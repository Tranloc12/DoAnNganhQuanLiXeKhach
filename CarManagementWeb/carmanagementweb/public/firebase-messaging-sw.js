// public/firebase-messaging-sw.js

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBH8ypW8EAE4BNhkj3Hb-LnCa1g0o3e_5s",
    authDomain: "carmangament.firebaseapp.com",
    projectId: "carmangament",
    storageBucket: "carmangament.firebasestorage.app",
    messagingSenderId: "989954131234",
    appId: "1:989954131234:web:f7fa0a9cf05dc5decad17b",
    measurementId: "G-FBR94DX8J4",
    databaseURL: "https://carmangament-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[SW] Received background message: ', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || "Thông báo mới";
    const notificationBody = payload.notification?.body || payload.data?.body || "Bạn có thông báo mới";
    
    // ✨ Lấy messageId an toàn, hoặc tạo mới nếu không có
    const uniqueMessageId = payload.messageId || `sw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[SW] Processing message with ID: ${uniqueMessageId}`);

    // Lấy danh sách thông báo cũ từ localStorage
    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");

    // ✨ KIỂM TRA TRÙNG LẶP TRƯỚC KHI LƯU
    if (stored.some(notif => notif.id === uniqueMessageId)) {
        console.warn(`[SW] Duplicate notification with ID ${uniqueMessageId} found in localStorage. Skipping save.`);
        // Vẫn hiển thị thông báo, chỉ không lưu lại nhiều lần
        self.registration.showNotification(notificationTitle, {
            body: notificationBody,
            icon: '/logo192.png',
            data: { url: payload.data?.click_action || "/" },
            tag: uniqueMessageId // Sử dụng tag để tránh hiển thị nhiều thông báo trình duyệt trùng lặp
        });
        return; 
    }
    
    // Tạo đối tượng thông báo mới để lưu
    const newNotif = {
        id: uniqueMessageId, // Dùng messageId đã kiểm tra
        title: notificationTitle,
        body: notificationBody,
        timestamp: Date.now(),
        read: false,
    };

    // Lưu thông báo mới vào đầu mảng và cập nhật localStorage
    const updated = [newNotif, ...stored];
    localStorage.setItem("notifications", JSON.stringify(updated));
    console.log(`[SW] New notification saved to localStorage with ID: ${uniqueMessageId}. Total: ${updated.length}`);

    const notificationOptions = {
        body: notificationBody,
        icon: '/logo192.png',
        data: {
            url: payload.data?.click_action || "/"
        },
        tag: uniqueMessageId // Sử dụng tag để tránh hiển thị nhiều thông báo trình duyệt trùng lặp
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    console.log('[SW] Notification click Received.');
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
            const urlToOpen = event.notification.data.url;
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});