// src/components/NotificationHandler.js

import React, { useEffect } from 'react';
import { messaging } from '../configs/Firebase';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = 'BDm1DqzS8hit8tlJsLtK6mNnAqDsYTIC5_lmyMS9vfhSgsJhajP7uSn07P42zo2NYxD3M7qVU3LW4dezBGl3ZkM';

const NotificationHandler = () => {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log('[App] Service Worker đã đăng ký thành công:', registration);

                    const requestAndSaveToken = async () => {
                        try {
                            const permission = await Notification.requestPermission();
                            if (permission === 'granted') {
                                console.log('[App] Quyền nhận thông báo đã được cấp.');
                                const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
                                
                                if (currentToken) {
                                    console.log('[App] FCM Registration Token:', currentToken);
                                    
                                    const yourJwtToken = localStorage.getItem('jwtToken'); 
                                    if (!yourJwtToken) {
                                        console.warn('[App] Không tìm thấy JWT Token. Không thể gửi FCM token lên backend.');
                                        return;
                                    }

                                    const response = await fetch('http://localhost:8080/api/users/save-fcm-token', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${yourJwtToken}` 
                                        },
                                        body: JSON.stringify({ token: currentToken })
                                    });

                                    if (response.ok) {
                                        const data = await response.json();
                                        console.log('[App] Lưu FCM token thành công:', data);
                                    } else {
                                        console.error('[App] Lỗi khi lưu FCM token trên backend:', response.statusText);
                                    }
                                } else {
                                    console.log('[App] Không có token khả dụng. Yêu cầu quyền để tạo một token.');
                                }
                            } else {
                                console.log('[App] Người dùng không cấp quyền nhận thông báo.');
                            }
                        } catch (err) {
                            console.error('[App] Lỗi xảy ra khi lấy FCM Token. ', err);
                        }
                    };

                    requestAndSaveToken();
                } catch (error) {
                    console.error('[App] Service Worker đăng ký thất bại:', error);
                }
            } else {
                console.warn('[App] Trình duyệt không hỗ trợ Service Worker.');
            }
        };

        registerServiceWorker();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("[App] Foreground Message received: ", payload);

            // ✨ Lấy messageId an toàn, hoặc tạo mới nếu không có
            const uniqueMessageId = payload.messageId || `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            console.log(`[App] Processing message with ID: ${uniqueMessageId}`);

            const stored = JSON.parse(localStorage.getItem("notifications") || "[]");

            // ✨ KIỂM TRA TRÙNG LẶP TRƯỚC KHI LƯU
            if (stored.some(notif => notif.id === uniqueMessageId)) {
                console.warn(`[App] Duplicate notification with ID ${uniqueMessageId} found in localStorage. Skipping save.`);
                // Vẫn hiển thị thông báo, chỉ không lưu lại nhiều lần
                if (Notification.permission === "granted") {
                    new Notification(payload?.notification?.title || "Thông báo", { body: payload?.notification?.body || "" });
                }
                return;
            }

            const newNotif = {
                id: uniqueMessageId, // Dùng messageId đã kiểm tra
                title: payload?.notification?.title || "Thông báo",
                body: payload?.notification?.body || "",
                timestamp: Date.now(),
                read: false,
            };
            const updated = [newNotif, ...stored];
            localStorage.setItem("notifications", JSON.stringify(updated));
            console.log(`[App] New notification saved to localStorage with ID: ${uniqueMessageId}. Total: ${updated.length}`);

            if (Notification.permission === "granted") {
                new Notification(newNotif.title, { body: newNotif.body });
            }

            window.dispatchEvent(new Event("storage"));
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return null;
};

export default NotificationHandler;