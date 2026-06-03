// src/components/PayPalReturnHandler.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { executePayPalPayment } from '../services/paypalService'; 
import { Spinner } from 'react-bootstrap'; 

const PayPalReturnHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Đang xử lý thanh toán PayPal...');
    const [loading, setLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const paymentId = query.get('paymentId');
        const payerId = query.get('PayerID');
        const token = query.get('token');
        const bookingId = query.get('bookingId'); // Thêm dòng này để lấy bookingId

        if (paymentId && payerId && token && bookingId) { // Thêm bookingId vào điều kiện kiểm tra
            setLoading(true);
            setStatus('Đang xác nhận giao dịch...');
            executePayPalPayment(paymentId, payerId, token, bookingId) // Truyền bookingId vào đây
                .then(() => {
                    setStatus('Thanh toán thành công! ✅ Bạn sẽ được chuyển hướng trong giây lát.');
                    setIsSuccess(true);
                    setTimeout(() => {
                        navigate('/bookings');
                    }, 3000);
                })
                .catch(error => {
                    setStatus(`Thanh toán thất bại: ${error.message} ❌ Vui lòng thử lại.`);
                    setIsSuccess(false);
                })
                .finally(() => {
                    setLoading(false);
                    const url = new URL(window.location.href);
                    url.searchParams.delete('paymentId');
                    url.searchParams.delete('PayerID');
                    url.searchParams.delete('token');
                    url.searchParams.delete('bookingId'); // Xóa bookingId khỏi URL
                    window.history.replaceState({}, document.title, url.toString());
                });
        } else {
            setStatus('Lỗi: Thiếu thông tin xác nhận thanh toán từ PayPal.');
            setLoading(false);
            setIsSuccess(false);
        }
    }, [location, navigate]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            {loading && <Spinner animation="border" role="status" className="mb-3" />}
            <h3 className={`mt-3 ${isSuccess ? 'text-success' : 'text-danger'}`}>{status}</h3>
            {!loading && !isSuccess && (
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                    Quay về trang chủ
                </button>
            )}
        </div>
    );
};

export default PayPalReturnHandler;