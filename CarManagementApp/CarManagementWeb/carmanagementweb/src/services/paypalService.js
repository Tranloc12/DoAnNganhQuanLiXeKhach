// src/services/paypalService.js
import { authApis, endpoints } from "../configs/Apis";

console.log("Endpoints in paypalService:", endpoints); // Debug

export const createPayPalPayment = async (bookingId, totalAmount) => {
    console.log("Endpoints.paypal:", endpoints.paypal); // Debug
    if (!endpoints.paypal) {
        throw new Error("endpoints.paypal is undefined");
    }
    try {
        // Kiểm tra bookingId và totalAmount
        if (!bookingId || isNaN(bookingId) || bookingId <= 0) {
            throw new Error("ID đặt vé không hợp lệ.");
        }
        if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
            throw new Error("Tổng tiền không hợp lệ.");
        }

        const api = authApis();

        // Tạo đối tượng FormData
        const formData = new FormData();
        formData.append('price', parseFloat(totalAmount)); // Thêm price vào FormData
        formData.append('bookingId', parseInt(bookingId)); // Thêm bookingId vào FormData
        // Nếu backend của bạn cần 'currency', hãy thêm vào đây:
        // formData.append('currency', 'USD');

        console.log("Gửi POST đến:", endpoints.paypal.createPayment, "với FormData:", formData); // Debug

        // Gửi FormData
        const response = await api.post(endpoints.paypal.createPayment, formData, {
            headers: {
                // Axios thường tự đặt Content-Type khi dùng FormData
                // Nếu backend trả về một chuỗi trần, không phải JSON, thì Axios sẽ parse nó thành string.
                // Không cần đặt 'Content-Type': 'multipart/form-data' ở đây nữa vì Axios tự lo.
            }
        });

        console.log("Phản hồi từ /paypal/create-payment:", response.data); // Debug

        // --- SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY ---
        // Kiểm tra nếu response.data là một chuỗi (URL trực tiếp từ backend)
        if (typeof response.data === 'string' && response.data.startsWith('http')) {
            return response.data; // Trả về trực tiếp chuỗi URL
        }
        // Nếu response.data là một đối tượng và có thuộc tính redirectUrl
        else if (response.data && response.data.redirectUrl) {
            return response.data.redirectUrl;
        }
        // Trường hợp còn lại: không tìm thấy URL
        else {
            throw new Error("Không nhận được URL chuyển hướng từ PayPal.");
        }
        // --- KẾT THÚC SỬA ĐỔI ---

    } catch (error) {
        console.error("Lỗi khi tạo thanh toán PayPal:", error.response?.data || error.message); // Debug chi tiết
        throw error;
    }
};

export const executePayPalPayment = async (paymentId, payerId, token, bookingId) => { // Thêm bookingId vào đây
    try {
        const api = authApis();
        console.log("Gửi GET đến:", endpoints.paypal.executePayment, "với params:", { paymentId, PayerID: payerId, token, bookingId }); // Debug
        const response = await api.get(endpoints.paypal.executePayment, {
            params: { paymentId, PayerID: payerId, token, bookingId } // Gửi bookingId trong params
        });

        console.log("Phản hồi từ /paypal/execute-payment:", response.data); // Debug
        
        // --- Sửa đổi quan trọng tại đây ---
        // Vì backend trả về một chuỗi thay vì JSON, bạn cần kiểm tra chuỗi này
        if (typeof response.data === 'string' && response.data.startsWith('Payment successful')) {
            return true;
        } else {
            const errorMessage = response.data?.message || "Thanh toán PayPal thất bại.";
            throw new Error(errorMessage);
        }
        // --- Kết thúc sửa đổi ---

    } catch (error) {
        console.error("Lỗi khi thực thi thanh toán PayPal:", error.response?.data || error.message);
        throw error;
    }
};