import React, { useState } from 'react';
import { authApis, endpoints } from "../../configs/Apis";

const PaymentButton = ({ price, bookingId }) => {
    const [approvalUrl, setApprovalUrl] = useState(null);

    const handlePayment = async () => {
        if (!bookingId) {
            alert("Vui lòng chọn một booking để thanh toán.");
            return;
        }
        try {
            const api = authApis();
            const response = await api.post(
                `${endpoints.paypal.createPayment}?price=${price}&bookingId=${bookingId}`
            );
            setApprovalUrl(response.data); // Lưu lại URL
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            alert("Đã xảy ra lỗi khi tạo thanh toán. Vui lòng thử lại.");
        }
    };

    return (
        <div>
            <button onClick={handlePayment}>
                Thanh toán cho Booking #{bookingId}
            </button>

            {approvalUrl && (
                <div style={{ marginTop: "20px" }}>
                    <iframe
                        src={approvalUrl}
                        title="PayPal Payment"
                        style={{ width: "100%", height: "600px", border: "none" }}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentButton;
