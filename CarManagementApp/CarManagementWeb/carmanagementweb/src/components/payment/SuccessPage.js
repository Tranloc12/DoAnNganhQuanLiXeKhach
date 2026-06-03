import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, endpoints } from '../../configs/Apis'; // Đảm bảo đường dẫn đúng

const SuccessPage = () => {
    const location = useLocation();
    const [message, setMessage] = useState("Đang xử lý thanh toán...");
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get('paymentId');
        const payerId = queryParams.get('PayerID');
        const bookingId = queryParams.get('bookingId');

        const executePayment = async () => {
            if (!paymentId || !payerId || !bookingId) {
                setMessage("Tham số thanh toán không hợp lệ.");
                setStatus('error');
                return;
            }

            try {
                // Sử dụng instance axios mặc định và endpoint đã định nghĩa
                const response = await api.get(`${endpoints.paypal.executePayment}?paymentId=${paymentId}&PayerID=${payerId}&bookingId=${bookingId}`);
                setMessage(response.data);
                setStatus('success');
            } catch (error) {
                console.error("Lỗi khi thực hiện thanh toán:", error);
                setMessage("Thanh toán không thành công. Vui lòng thử lại.");
                setStatus('error');
            }
        };

        executePayment();
    }, [location]);

    return (
        <div /* ... styling ... */ >
            {/* ... content ... */}
        </div>
    );
};

export default SuccessPage;