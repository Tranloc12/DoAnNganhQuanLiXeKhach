import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Deck from './Deck'; // Import từ file riêng
import Legend from './Legend'; // Import từ file riêng
import BookingSteps from './BookingSteps'; // Import từ file riêng
import './SeatBooking.css'; // Import CSS riêng
import apis, { authApis, endpoints } from "../../configs/Apis"; // Import từ configs/Apis
import QRCode from "react-qr-code"; // Import từ thư viện (cần cài đặt: npm install react-qr-code)
import { createPayPalPayment, executePayPalPayment } from "../../services/paypalService";
import { useNavigate } from 'react-router-dom';
import { AuthLoadingContext, MyUserContext } from "../../contexts/Contexts";
import { getAllTransferPoints } from "../transferPoint/transferPointApi";




const SeatBooking = () => {
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(0); // 0: chọn ghế, 1: thông tin khách hàng, 2: chọn thanh toán, 3: hoàn tất
    const [trip, setTrip] = useState(null);
    const [lowerDeckSeats, setLowerDeckSeats] = useState([]);
    const [upperDeckSeats, setUpperDeckSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [form, setForm] = useState({ fullname: "", phone: "", email: "" });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vietqr"); // Default selected
    const [remainingTime, setRemainingTime] = useState(1200); // 1200 giây = 20 phút
    const [bookingId, setBookingId] = useState(null); // Lưu bookingId sau khi đặt vé thành công

    const [transferPoints, setTransferPoints] = useState([]); // New state for transfer points
    const [shuttle, setShuttle] = useState({
        pickupPoint: null,
        dropoffPoint: null,
        pickupInputType: "dropdown",
        dropoffInputType: "dropdown",
        pickupAddress: "",
        dropoffAddress: "",
        pickupArrivalTime: "", // New field
        pickupDepartureTime: "", // New field
        pickupStopOrder: 1, // Default stop order for pickup
        pickupNote: "Pickup point for passenger", // Default note
        dropoffArrivalTime: "", // New field
        dropoffDepartureTime: "", // New field
        dropoffStopOrder: 2, // Default stop order for dropoff
        dropoffNote: "Dropoff point for passenger", // Default note
    });

    const navigate = useNavigate();

    // Access context
    const user = useContext(MyUserContext);
    const authLoading = useContext(AuthLoadingContext);


    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleShuttleChange = (e) => {
        setShuttle({ ...shuttle, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodClick = (method) => {
        setSelectedPaymentMethod(method);
        setMessage(''); // Xóa thông báo khi đổi phương thức thanh toán
    };

    const togglePickupInputType = () => {
        setShuttle({
            ...shuttle,
            pickupInputType: shuttle.pickupInputType === "dropdown" ? "text" : "dropdown",
            pickupPoint: shuttle.pickupInputType === "dropdown" ? "" : shuttle.pickupPoint,
            pickupAddress: shuttle.pickupInputType === "text" ? "" : shuttle.pickupAddress
        });
    };

    const toggleDropoffInputType = () => {
        setShuttle({
            ...shuttle,
            dropoffInputType: shuttle.dropoffInputType === "dropdown" ? "text" : "dropdown",
            dropoffPoint: shuttle.dropoffInputType === "dropdown" ? "" : shuttle.dropoffPoint,
            dropoffAddress: shuttle.dropoffInputType === "text" ? "" : shuttle.dropoffAddress
        });
    };

    const generateInitialSeatsStructure = () => {
        const lowerDeckRows = [2, 3, 3, 3, 3, 3];
        const upperDeckRows = [2, 3, 3, 3, 3, 3];

        let lowerSeatIndex = 1;
        const generatedLower = lowerDeckRows.map((seatsInRow) =>
            Array.from({ length: seatsInRow }, () => ({
                seatNumber: `A${lowerSeatIndex++}`,
            }))
        );

        let upperSeatIndex = 1;
        const generatedUpper = upperDeckRows.map((seatsInRow) =>
            Array.from({ length: seatsInRow }, () => ({
                seatNumber: `B${upperSeatIndex++}`,
            }))
        );

        setLowerDeckSeats(generatedLower);
        setUpperDeckSeats(generatedUpper);
    };

    // Sử dụng useEffect để tạo bộ đếm thời gian giữ chỗ
    useEffect(() => {
        if (currentStep === 2 && remainingTime > 0) { // Chỉ đếm ngược ở bước thanh toán
            const timerId = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (remainingTime <= 0 && currentStep === 2) {
            setMessage("Thời gian giữ chỗ đã hết! Vui lòng đặt vé lại.");
            // Tùy chọn: bạn có thể tự động hủy booking trên server ở đây
            // setCurrentStep(0); // Quay về bước chọn ghế
        }
    }, [currentStep, remainingTime]);

    // Hàm để format thời gian từ giây sang định dạng MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getQrCodeValue = () => {
        const total = (selectedSeats.length * (trip?.fare || 0));
        const baseValue = `Thanh toán chuyến ${trip?.routeName || ""}, ghế: ${selectedSeats.join(", ")}`;

        // Nội dung QR code tùy thuộc vào phương thức thanh toán
        switch (selectedPaymentMethod) {
            case 'vietqr':
                return `VIETQR:${form.phone},${total},${baseValue}`;
            case 'futapay':
                return `FUTAPAY:${form.phone},${total},${baseValue}`;
            case 'zalopay':
                return `ZALOPAY:${form.phone},${total},${baseValue}`;
            case 'shopeepay':
                return `SHOPEEPAY:${form.phone},${total},${baseValue}`;
            case 'momo':
                return `MOMO:${form.phone},${total},${baseValue}`;
            case 'vnpay':
                return `VNPAY:${form.phone},${total},${baseValue}`;
            case 'viettelmoney':
                return `VIETTELMONEY:${form.phone},${total},${baseValue}`;
            case 'mbbank':
                return `MBBANK:${form.phone},${total},${baseValue}`;
            case 'atm':
                return `Vui lòng làm theo hướng dẫn của ngân hàng để thanh toán ATM nội địa.`;
            case 'visa':
                return `Vui lòng làm theo hướng dẫn để nhập thông tin thẻ Visa/Master/JCB.`;
            default:
                return `${baseValue} - Tổng: ${total.toLocaleString('vi-VN')} VNĐ`;
        }
    };

    const generateSeatsFromCapacity = (capacity) => {
        // Giả sử chia đều 2 tầng
        const lowerDeckCount = Math.ceil(capacity / 2);
        const upperDeckCount = capacity - lowerDeckCount;

        const lowerDeckRows = [];
        const upperDeckRows = [];

        // Ví dụ mỗi hàng tối đa 4 ghế (có thể điều chỉnh)
        const seatsPerRow = 3;

        // Tạo ghế tầng dưới
        let seatIndex = 1;
        let remaining = lowerDeckCount;
        while (remaining > 0) {
            const rowSeats = Math.min(seatsPerRow, remaining);
            lowerDeckRows.push(
                Array.from({ length: rowSeats }, () => ({
                    seatNumber: `A${seatIndex++}`,
                }))
            );
            remaining -= rowSeats;
        }

        // Tạo ghế tầng trên
        remaining = upperDeckCount;
        seatIndex = 1;
        while (remaining > 0) {
            const rowSeats = Math.min(seatsPerRow, remaining);
            upperDeckRows.push(
                Array.from({ length: rowSeats }, () => ({
                    seatNumber: `B${seatIndex++}`,
                }))
            );
            remaining -= rowSeats;
        }

        setLowerDeckSeats(lowerDeckRows);
        setUpperDeckSeats(upperDeckRows);
    };


    // Lấy dữ liệu chuyến đi và các ghế đã đặt
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const tripRes = await apis.get(`${endpoints.trips}/${id}`);
                setTrip(tripRes.data);
                generateSeatsFromCapacity(tripRes.data.busCapacity);
                const bookingsRes = await apis.get(`${endpoints.bookings}?status=CONFIRMED`);
                const allBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : (bookingsRes.data ? [bookingsRes.data] : []);
                const booked = allBookings
                    .filter(b => b.tripId?.id === parseInt(id))
                    .flatMap(b => b.seatNumbers?.split(",").map(s => s.trim()) || []);
                setBookedSeats(booked);
                const transferPointsRes = await getAllTransferPoints();
                setTransferPoints(transferPointsRes);
            } catch (err) {
                console.error(err);
                setMessage("Lỗi khi tải dữ liệu chuyến đi, ghế đã đặt hoặc điểm trung chuyển.");
            }
        };
        fetchData();
    }, [id]);

    const getSeatStatus = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return 'sold';
        if (selectedSeats.includes(seatNumber)) return 'selected';
        return 'available';
    };

    const toggleSeat = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return;
        setSelectedSeats(prev => prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]);
        setMessage(''); // Xóa thông báo khi chọn/bỏ chọn ghế
    };

    // Bước 1: Xử lý tạo booking (Sau khi chọn ghế và điền thông tin)
    const handleBooking = async () => {
        // Validation
        if (selectedSeats.length === 0) {
            setMessage("Vui lòng chọn ít nhất 1 ghế.");
            return;
        }
        if (!form.fullname || !form.phone || !form.email) {
            setMessage("Vui lòng nhập đầy đủ thông tin khách hàng.");
            return;
        }
        if (
            (shuttle.pickupInputType === "dropdown" && !shuttle.pickupPoint) ||
            (shuttle.pickupInputType === "text" && !shuttle.pickupAddress) ||
            (shuttle.dropoffInputType === "dropdown" && !shuttle.dropoffPoint) ||
            (shuttle.dropoffInputType === "text" && !shuttle.dropoffAddress)
        ) {
            setMessage("Vui lòng chọn hoặc nhập đầy đủ điểm trung chuyển.");
            return;
        }

        setLoading(true);
        setMessage("Đang xử lý đặt chỗ...");

        try {
            // Step 1: Create transfer points for custom addresses (if applicable)
            let pickupTransferPointId = shuttle.pickupPoint;
            let dropoffTransferPointId = shuttle.dropoffPoint;

            // Handle custom pickup address
            if (shuttle.pickupInputType === "text" && shuttle.pickupAddress) {
                try {
                    const response = await authApis().post(endpoints.transferPoints, {
                        name: "Custom Pickup",
                        address: shuttle.pickupAddress,
                        city: "Unknown", // You may need to add a city field to the form
                    });
                    pickupTransferPointId = response.data.id;
                } catch (err) {
                    console.error("Lỗi khi tạo điểm trung chuyển pickup:", err);
                    setMessage("Lỗi khi tạo điểm trung chuyển pickup.");
                    setLoading(false);
                    return;
                }
            }

            // Handle custom dropoff address
            if (shuttle.dropoffInputType === "text" && shuttle.dropoffAddress) {
                try {
                    const response = await authApis().post(endpoints.transferPoints, {
                        name: "Custom Dropoff",
                        address: shuttle.dropoffAddress,
                        city: "Unknown", // You may need to add a city field to the form
                    });
                    dropoffTransferPointId = response.data.id;
                } catch (err) {
                    console.error("Lỗi khi tạo điểm trung chuyển dropoff:", err);
                    setMessage("Lỗi khi tạo điểm trung chuyển dropoff.");
                    setLoading(false);
                    return;
                }
            }

            // Step 2: Create the booking
            const numberOfSeats = selectedSeats.length;
            const bookingResponse = await authApis().post(endpoints.bookings, {
                tripId: trip.id,
                numberOfSeats: numberOfSeats,
                seatNumbers: selectedSeats.join(","),
                pickupPoint: pickupTransferPointId,
                dropoffPoint: dropoffTransferPointId,
            });

            const newBookingId = bookingResponse.data.id || bookingResponse.data.bookingId;

            if (!newBookingId) {
                setMessage("Đặt chỗ thất bại: Không nhận được ID đặt vé từ hệ thống.");
                console.error("Phản hồi API đặt chỗ không chứa 'id' hoặc 'bookingId':", bookingResponse.data);
                setLoading(false);
                return;
            }

            // Step 3: Create trip transfers for pickup and dropoff points
            const currentDate = new Date();
            const defaultArrivalTime = new Date(currentDate.getTime() + 15 * 60 * 1000).toISOString(); // 15 minutes later
            const defaultDepartureTime = new Date(currentDate.getTime() + 20 * 60 * 1000).toISOString(); // 20 minutes later

            // Pickup transfer
            if (pickupTransferPointId) {
                try {
                    await authApis().post(endpoints.triptransfers, {
                        arrivalTime: shuttle.pickupArrivalTime || defaultArrivalTime,
                        departureTime: shuttle.pickupDepartureTime || defaultDepartureTime,
                        stopOrder: shuttle.pickupStopOrder || 1,
                        note: shuttle.pickupNote || "Pickup point for passenger",
                        transferPointId: { id: parseInt(pickupTransferPointId) },
                        tripId: { id: parseInt(trip.id) },
                    });
                } catch (err) {
                    console.error("Lỗi khi tạo trip transfer cho pickup:", err);
                    setMessage("Lỗi khi tạo điểm trung chuyển pickup.");
                    setLoading(false);
                    return;
                }
            }

            // Dropoff transfer
            if (dropoffTransferPointId) {
                try {
                    await authApis().post(endpoints.triptransfers, {
                        arrivalTime: shuttle.dropoffArrivalTime || defaultArrivalTime,
                        departureTime: shuttle.dropoffDepartureTime || defaultDepartureTime,
                        stopOrder: shuttle.dropoffStopOrder || 2,
                        note: shuttle.dropoffNote || "Dropoff point for passenger",
                        transferPointId: { id: parseInt(dropoffTransferPointId) },
                        tripId: { id: parseInt(trip.id) },
                    });
                } catch (err) {
                    console.error("Lỗi khi tạo trip transfer cho dropoff:", err);
                    setMessage("Lỗi khi tạo điểm trung chuyển dropoff.");
                    setLoading(false);
                    return;
                }
            }

            // Step 4: Proceed to payment step
            setBookingId(newBookingId);
            setCurrentStep(2); // Move to payment method selection
            setMessage("Đặt chỗ thành công! Vui lòng chọn phương thức thanh toán.");
            setRemainingTime(1200);

        } catch (err) {
            console.error("Lỗi khi đặt chỗ:", err);
            if (err.response && err.response.status === 401) {
                setMessage("Vui lòng đăng nhập để đặt vé.");
                navigate("/login");
            } else {
                if (!user) {
                    setMessage("Vui lòng đăng nhập để đặt vé.");
                    navigate("/login");
                    return;
                }
                setMessage("Đặt chỗ thất bại: Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };


    // Bước 2: Xử lý hành động thanh toán cuối cùng (khi nhấn nút "Thanh toán" ở bước chọn phương thức)
    const initiatePayPalPayment = async () => {
        console.log("Khởi tạo thanh toán PayPal với bookingId:", bookingId); // Debug
        if (!bookingId) {
            setMessage("Lỗi: Không tìm thấy ID đặt vé để thanh toán PayPal. Vui lòng quay lại bước đặt chỗ.");
            console.error("Booking ID bị thiếu.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setMessage("Đang khởi tạo giao dịch PayPal...");

        try {
            const totalAmount = selectedSeats.length * (trip?.fare || 0);
            if (totalAmount <= 0 || isNaN(totalAmount)) {
                setMessage("Lỗi: Tổng số tiền thanh toán không hợp lệ.");
                setLoading(false);
                return;
            }

            const redirectUrl = await createPayPalPayment(bookingId, totalAmount);

            if (redirectUrl) {
                setMessage("Đang chuyển hướng đến PayPal...");

                // ✅ SỬA: Dùng window.open để mở tab mới
                const newWindow = window.open(redirectUrl, '_blank', 'noopener=yes,noreferrer=yes');
                if (newWindow) {
                    // ✅ THÊM: Bắt đầu kiểm tra trạng thái thanh toán sau khi mở tab
                    pollPaymentStatus(bookingId);
                } else {
                    setMessage('Vui lòng cho phép trình duyệt mở cửa sổ pop-up để thanh toán.');
                }

            } else {
                setMessage("Lỗi: Không nhận được URL chuyển hướng từ PayPal.");
            }
        } catch (error) {
            console.error("Lỗi trong initiatePayPalPayment:", error.response?.data || error.message);
            setMessage(`Lỗi khi khởi tạo thanh toán PayPal: ${error.message || "Lỗi không xác định"}`);
        } finally {
            setLoading(false);
        }
    };

    const pollPaymentStatus = (currentBookingId) => {
        const intervalId = setInterval(async () => {
            try {
                // Gọi một API mới để kiểm tra trạng thái booking
                const res = await authApis().get(`${endpoints.bookings}/${currentBookingId}/status`);

                // Giả sử API backend trả về status là 'CONFIRMED' khi thanh toán thành công
                if (res.data.status === 'CONFIRMED') {
                    clearInterval(intervalId); // Dừng việc kiểm tra
                    setMessage('Thanh toán PayPal thành công! ✅');
                    setCurrentStep(3); // Chuyển sang bước hoàn tất
                    setTimeout(() => {
                        window.location.href = '/bookings'; // Chuyển hướng về trang bookings
                    }, 3000);

                }

            } catch (error) {
                // Xử lý lỗi nếu cần
                console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
            }
        }, 5000); // Kiểm tra mỗi 5 giây
    };
    const handleFinalPayment = async () => {
        console.log("handleFinalPayment gọi, selectedPaymentMethod:", selectedPaymentMethod, "remainingTime:", remainingTime, "bookingId:", bookingId); // Debug
        if (remainingTime <= 0) {
            setMessage("Thời gian giữ chỗ đã hết. Vui lòng đặt vé lại.");
            setCurrentStep(0);
            if (bookingId) {
                try {
                    await authApis().delete(`${endpoints.bookings}/${bookingId}`);
                    console.log("Đã hủy booking:", bookingId); // Debug
                    setBookingId(null);
                    setSelectedSeats([]);
                } catch (error) {
                    console.error("Lỗi khi hủy booking:", error);
                }
            }
            return;
        }

        if (selectedPaymentMethod === 'paypal') {
            await initiatePayPalPayment();
        } else {
            setMessage(`Vui lòng hoàn tất thanh toán bằng phương thức ${selectedPaymentMethod}. Quét mã QR hoặc làm theo hướng dẫn.`);
        }
    };


    const mappedLowerDeckSeats = lowerDeckSeats.map(row =>
        row.map(seat => ({ ...seat, status: getSeatStatus(seat.seatNumber) }))
    );
    const mappedUpperDeckSeats = upperDeckSeats.map(row =>
        row.map(seat => ({ ...seat, status: getSeatStatus(seat.seatNumber) }))
    );

    // Render giao diện theo currentStep
    if (currentStep === 2) { // Bước 2: Chọn phương thức thanh toán
        return (
            <div className="payment-step">
                <BookingSteps currentStep={currentStep} />
                <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Chọn phương thức thanh toán</h2>
                {message && (
                    <div className={`text-center p-4 rounded-lg mb-4 font-bold 
                            ${message.includes('thành công') ? 'bg-green-100 text-green-700' : (message.includes('Lỗi') || message.includes('thất bại') || message.includes('hết')) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {message}
                    </div>
                )}
                <div className="payment-step-grid">
                    <div className="payment-methods">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {/* Nút PayPal */}
                            <button
                                className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'paypal' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('paypal')}
                                disabled={loading}
                            >
                                <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="PayPal" style={{ width: 40, height: 40 }} />
                                <span>PayPal</span>
                            </button>
                            {/* Các nút phương thức thanh toán khác */}
                            <button className={`book-button flex flex-col items-center ${selectedPaymentMethod === 'vietqr' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('vietqr')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/goopay_cd76ab3401/goopay_cd76ab3401.svg" alt="VietQR" style={{ width: 40, height: 40 }} />
                                <span>VietQR</span>
                            </button>
                            <button className={`book-button flex flex-col items-center ${selectedPaymentMethod === 'futapay' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('futapay')} disabled={loading}>
                                <img src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png" alt="FUTAPay" style={{ width: 40, height: 40 }} />
                                <span>FUTAPay</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'zalopay' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('zalopay')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/zalopay_fcfdae0580/zalopay_fcfdae0580.svg" alt="ZaloPay" style={{ width: 40, height: 40 }} />
                                <span>ZaloPay</span>
                                <span className="absolute top-1 right-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">-25% tối đa 20k</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'shopeepay' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('shopeepay')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/Logo_Shopee_Pay_2024_1fb07ef622/Logo_Shopee_Pay_2024_1fb07ef622.png" alt="ShopeePay" style={{ width: 40, height: 40 }} />
                                <span>ShopeePay</span>
                                <span className="absolute top-1 right-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-semibold">-20% tối đa 50k</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'momo' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('momo')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/momo_bb732ac6f7/momo_bb732ac6f7.svg" alt="MoMo" style={{ width: 40, height: 40 }} />
                                <span>MoMo</span>
                                <span className="absolute top-1 right-1 text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-semibold">FUTAMOMO20 -20k</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'vnpay' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('vnpay')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/vnpay_fdc107eeec/vnpay_fdc107eeec.svg" alt="VNPay" style={{ width: 40, height: 40 }} />
                                <span>VNPay</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'viettelmoney' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('viettelmoney')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/viettelpay_3dafdea279/viettelpay_3dafdea279.svg" alt="Viettel Money" style={{ width: 40, height: 40 }} />
                                <span>Viettel Money</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'mbbank' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('mbbank')} disabled={loading}>
                                <img src="https://storage.googleapis.com/futa-busline-web-cms-prod/viet_QR_e6b170910a/viet_QR_e6b170910a.png" alt="MB Bank" style={{ width: 40, height: 40 }} />
                                <span>MB Bank</span>
                                <span className="text-xs text-blue-700 mt-1">Quét mã an toàn</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'atm' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('atm')} disabled={loading}>
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="ATM nội địa" style={{ width: 40, height: 40 }} />
                                <span>ATM nội địa</span>
                            </button>
                            <button className={`book-button flex flex-col items-center relative ${selectedPaymentMethod === 'visa' ? 'active' : ''}`}
                                onClick={() => handlePaymentMethodClick('visa')} disabled={loading}>
                                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa/Master/JCB" style={{ width: 40, height: 40 }} />
                                <span>Visa/Master/JCB</span>
                            </button>
                        </div>
                        {/* Hiển thị QR code hoặc nút PayPal tùy phương thức được chọn */}
                        {selectedPaymentMethod !== 'paypal' ? (
                            <>
                                <div className="flex-1 flex flex-col items-center justify-center info-card mt-4">
                                    <h3 className="font-bold text-lg mb-3 text-blue-900">Mã QR thanh toán</h3>
                                    <div className="qr-box">
                                        {/* Sử dụng QRCode component nếu đã cài đặt thư viện react-qr-code */}
                                        {/* <QRCode value={getQrCodeValue()} size={180} bgColor="#fff" /> */}
                                        <p className="text-gray-700 text-sm">
                                            Để hiển thị mã QR hình ảnh, bạn cần cài đặt thư viện 'react-qr-code' bằng lệnh `npm install react-qr-code` hoặc `yarn add react-qr-code`.
                                        </p>
                                        <p className="font-mono text-xs text-blue-800 mt-2 break-all">{getQrCodeValue()}</p>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2 text-center">Quét mã để thanh toán nhanh</div>
                                </div>

                                <div className="info-card mt-8">
                                    <b>Hướng dẫn thanh toán :</b>
                                    <ol className="list-decimal ml-5 mt-1 space-y-0.5 text-sm">
                                        <li>Mở ứng dụng trên điện thoại</li>
                                        <li>Dùng biểu tượng <b>quét mã</b> để quét mã QR</li>
                                        <li>Quét mã ở trang này và thanh toán</li>
                                    </ol>
                                </div>
                            </>
                        ) : (
                            <div className="paypal-button-container info-card mt-4 text-center">
                                <p className="text-lg text-gray-700 mb-4">
                                    Vui lòng nhấn nút bên dưới để chuyển hướng đến trang thanh toán của PayPal.
                                </p>
                                <button
                                    onClick={handleFinalPayment} // Gọi hàm xử lý thanh toán cuối cùng
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out 
            ${(loading || !bookingId || remainingTime <= 0) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    disabled={loading || !bookingId || remainingTime <= 0} // Vô hiệu hóa nút nếu đang loading, chưa có bookingId hoặc hết thời gian
                                >
                                    {loading ? "Đang chuyển hướng..." : "Thanh toán với PayPal"}
                                </button>
                                {(!bookingId || remainingTime <= 0) && (
                                    <p className="text-red-600 text-sm mt-2">
                                        {remainingTime <= 0 ? "Thời gian giữ chỗ đã hết, không thể thanh toán." : "Lỗi: Không tìm thấy ID đặt vé. Vui lòng quay lại bước đặt chỗ."}
                                    </p>
                                )}
                            </div>
                        )}
                        <button className="back-button mt-4" onClick={() => setCurrentStep(1)} disabled={loading}>
                            Quay lại
                        </button>
                    </div>

                    <div className="order-summary">
                        <div className="info-card">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Tổng thanh toán</span>
                                <span className="text-2xl font-bold text-red-600"> {(selectedSeats.length * (trip?.fare || 0)).toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Thời gian giữ chỗ còn lại</span>
                                <span className="font-mono text-lg text-blue-700">
                                    {formatTime(remainingTime)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-blue-100">
                            <h3 className="font-bold text-base mb-1 text-blue-900">Thông tin hành khách</h3>
                            <div className="text-sm">
                                <div><strong>Họ và tên:</strong> {form.fullname}</div>
                                <div><strong>Số điện thoại:</strong> {form.phone}</div>
                                <div><strong>Email:</strong> {form.email}</div>
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <h3 className="font-bold text-base mb-1 text-orange-900">Thông tin lượt đi</h3>
                            <div className="text-sm">
                                <div><strong>Tuyến xe:</strong> {trip?.routeName}</div>
                                <div><strong>Thời gian xuất bến:</strong> {trip?.departureTime ? `${trip.departureTime[3]}:${String(trip.departureTime[4]).padStart(2, '0')} ${trip.departureTime[2]}/${trip.departureTime[1]}/${trip.departureTime[0]}` : ""}</div>
                                <div><strong>Số lượng ghế:</strong> {selectedSeats.length} Ghế</div>
                                <div><strong>Số ghế:</strong> {selectedSeats.join(", ")}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentStep === 3) { // Bước 3: Hoàn tất/Thanh toán thành công
        return (
            <div className="confirmation-step text-center p-8 bg-white rounded-xl shadow-lg border border-green-100 max-w-2xl mx-auto">
                <BookingSteps currentStep={currentStep} />
                <h2 className="text-4xl font-bold text-green-700 mb-6">Thanh toán thành công! 🎉</h2>
                <p className="text-lg text-gray-700 mb-4">Mã đặt vé của bạn là: <strong className="text-blue-600 text-2xl">{bookingId}</strong></p>
                <p className="text-md text-gray-600 mb-8">Bạn sẽ nhận được email xác nhận chi tiết vé sớm nhất.</p>
                <button
                    onClick={() => { /* Logic điều hướng đến trang lịch sử đặt vé hoặc trang chủ */ }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300"
                >
                    Xem chi tiết vé của tôi
                </button>
                <button
                    onClick={() => setCurrentStep(0)}
                    className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl transition duration-300"
                >
                    Đặt vé mới
                </button>
            </div>
        );
    }

    // Default: currentStep === 0 (Chọn ghế) hoặc currentStep === 1 (Thông tin khách hàng)
    return (
        <div className="seat-booking-container">
            <BookingSteps currentStep={currentStep} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phần chọn ghế */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-800 drop-shadow">Chọn ghế</h1>
                    </div>
                    <div className="deck-container">
                        <div style={{ width: "100%", marginBottom: 16 }}>
                            <Legend />
                        </div>
                        <div className="deck deck-lower">
                            <Deck
                                title="Tầng dưới"
                                seats={mappedLowerDeckSeats}
                                onSeatClick={toggleSeat}
                                isMatrix={true}
                            />
                        </div>
                        <div className="deck deck-upper">
                            <Deck
                                title="Tầng trên"
                                seats={mappedUpperDeckSeats}
                                onSeatClick={toggleSeat}
                                isMatrix={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Phần thông tin đơn hàng và thông tin khách hàng */}
                <div className="flex flex-col gap-6">
                    {trip && (
                        <div className="trip-info shadow-lg transition hover:shadow-xl mb-0">
                            <h3 className="text-xl font-bold mb-3 text-blue-900 flex items-center gap-2">
                                <span style={{ fontSize: 22 }}>🚌</span> Thông tin xe
                            </h3>
                            <p><strong>Tuyến:</strong> {trip.routeName}</p>
                            <p><strong>Biển số xe:</strong> {trip.busLicensePlate}</p>
                            <p><strong>Giờ khởi hành:</strong> {trip.departureTime[3]}:{String(trip.departureTime[4]).padStart(2, '0')} ngày {trip.departureTime[2]}/{trip.departureTime[1]}/{trip.departureTime[0]}</p>
                            <p><strong>Giá vé:</strong> <span style={{ color: "#e74c3c", fontWeight: 700 }}>{trip.fare?.toLocaleString('vi-VN')} VNĐ</span></p>
                        </div>
                    )}
                    <div className="bg-white p-7 rounded-2xl shadow-xl border border-blue-100 transition hover:shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center gap-2">
                            <span style={{ fontSize: 22 }}>🧾</span> Thông tin đơn hàng
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b pb-3">
                                <span className="text-lg text-gray-700">Ghế đang chọn:</span>
                                <span style={{
                                    background: selectedSeats.length > 0 ? "#e3f2fd" : "#f8d7da",
                                    color: selectedSeats.length > 0 ? "#1976d2" : "#c0392b",
                                    fontWeight: 700,
                                    borderRadius: 16,
                                    padding: "4px 16px",
                                    fontSize: 16,
                                    minWidth: 80,
                                    textAlign: "center",
                                    transition: "background 0.2s"
                                }}>
                                    {selectedSeats.length > 0 ? selectedSeats.sort().join(", ") : "Chưa chọn"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-3">
                                <span className="text-lg text-gray-700">Tổng số ghế:</span>
                                <span style={{
                                    background: "#fff3e0",
                                    color: "#ef6c00",
                                    fontWeight: 700,
                                    borderRadius: 16,
                                    padding: "4px 16px",
                                    fontSize: 16,
                                    minWidth: 40,
                                    textAlign: "center"
                                }}>
                                    {selectedSeats.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-3">
                                <span className="text-lg text-gray-700">Giá mỗi vé:</span>
                                <span style={{
                                    background: "#e8f5e9",
                                    color: "#388e3c",
                                    fontWeight: 700,
                                    borderRadius: 16,
                                    padding: "4px 16px",
                                    fontSize: 16,
                                    minWidth: 80,
                                    textAlign: "center"
                                }}>
                                    {trip?.fare ? trip.fare.toLocaleString('vi-VN') + " VNĐ" : "--"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-xl mt-4">
                                <span style={{ color: "#374151" }}>Tổng tiền:</span>
                                <span style={{
                                    color: "#e53935",
                                    background: "#ffebee",
                                    borderRadius: 16,
                                    padding: "8px 28px",
                                    fontWeight: 800,
                                    fontSize: 22,
                                    boxShadow: "0 2px 8px rgba(229,57,53,0.07)"
                                }}>
                                    {(selectedSeats.length * (trip?.fare || 0)).toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                        </div>
                        {currentStep === 0 && ( // Chỉ hiển thị nút "Tiếp tục" ở bước chọn ghế
                            <button
                                onClick={() => setCurrentStep(1)} // Chuyển sang bước nhập thông tin khách hàng
                                className="book-button w-full mt-8 font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 text-xl"
                                disabled={selectedSeats.length === 0 || loading}
                                style={{
                                    background: "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                                    color: "#fff",
                                    letterSpacing: 1
                                }}
                            >
                                Tiếp tục
                            </button>
                        )}
                        {message && currentStep === 0 && ( // Chỉ hiển thị thông báo ở bước 0 nếu có lỗi
                            <p className="text-red-600 text-center mt-2 font-medium">{message}</p>
                        )}
                        <div className="text-center mt-8">
                            <a href="/terms" className="text-red-600 hover:underline font-bold text-lg">ĐIỀU KHOẢN & LƯU Ý</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form thông tin khách hàng (chỉ hiển thị ở bước 1) */}
            {currentStep === 1 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                        <span style={{ fontSize: 24 }}>👤</span> Thông tin khách hàng
                    </h3>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 max-w-xl mx-auto">
                        {selectedSeats.length > 0 ? (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                                <div>
                                    <label className="block font-semibold mb-2 text-blue-700" htmlFor="fullname">Họ và tên</label>
                                    <input
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        className="custom-input"
                                        placeholder="Nhập họ tên..."
                                        required
                                        value={form.fullname}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2 text-blue-700" htmlFor="phone">Số điện thoại</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="custom-input"
                                        placeholder="Nhập số điện thoại..."
                                        required
                                        value={form.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2 text-blue-700" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="custom-input"
                                        placeholder="Nhập email..."
                                        required
                                        value={form.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="shuttle-selection-step">
                                    <h2 className="font-semibold mb-4 text-blue-700 text-lg">Chọn hoặc nhập thông tin bến đi và bến đến</h2>
                                    {transferPoints.length === 0 && (
                                        <p className="text-red-600 text-center mb-4">Không có điểm trung chuyển nào khả dụng, vui lòng nhập địa chỉ.</p>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-semibold mb-2 text-blue-700">Bến đi</label>
                                            <button
                                                type="button"
                                                onClick={togglePickupInputType}
                                                className="mb-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
                                            >
                                                {shuttle.pickupInputType === "dropdown" ? "Nhập địa chỉ tùy chỉnh" : "Chọn từ danh sách"}
                                            </button>
                                            {shuttle.pickupInputType === "dropdown" ? (
                                                <select
                                                    id="pickupPoint"
                                                    name="pickupPoint"
                                                    value={shuttle.pickupPoint || ""}
                                                    onChange={handleShuttleChange}
                                                    className="custom-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required={shuttle.pickupInputType === "dropdown"}
                                                >
                                                    <option value="">Chọn bến đi</option>
                                                    {transferPoints.map((point) => (
                                                        <option key={point.id} value={point.id}>
                                                            {point.name} - {point.address} ({point.city})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    id="pickupAddress"
                                                    name="pickupAddress"
                                                    type="text"
                                                    className="custom-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Nhập địa chỉ bến đi..."
                                                    value={shuttle.pickupAddress}
                                                    onChange={handleShuttleChange}
                                                    required={shuttle.pickupInputType === "text"}
                                                />
                                            )}
                                            
                                            <div className="mt-4">
                                                <label className="block font-semibold mb-2 text-blue-700" htmlFor="pickupNote">Ghi chú (Pickup)</label>
                                                <input
                                                    id="pickupNote"
                                                    name="pickupNote"
                                                    type="text"
                                                    className="custom-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ghi chú cho điểm đón..."
                                                    value={shuttle.pickupNote}
                                                    onChange={handleShuttleChange}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-semibold mb-2 text-blue-700">Bến đến</label>
                                            <button
                                                type="button"
                                                onClick={toggleDropoffInputType}
                                                className="mb-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
                                            >
                                                {shuttle.dropoffInputType === "dropdown" ? "Nhập địa chỉ tùy chỉnh" : "Chọn từ danh sách"}
                                            </button>
                                            {shuttle.dropoffInputType === "dropdown" ? (
                                                <select
                                                    id="dropoffPoint"
                                                    name="dropoffPoint"
                                                    value={shuttle.dropoffPoint || ""}
                                                    onChange={handleShuttleChange}
                                                    className="custom-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required={shuttle.dropoffInputType === "dropdown"}
                                                >
                                                    <option value="">Chọn bến đến</option>
                                                    {transferPoints.map((point) => (
                                                        <option key={point.id} value={point.id}>
                                                            {point.name} - {point.address} ({point.city})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    id="dropoffAddress"
                                                    name="dropoffAddress"
                                                    type="text"
                                                    className="custom-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Nhập địa chỉ bến đến..."
                                                    value={shuttle.dropoffAddress}
                                                    onChange={handleShuttleChange}
                                                    required={shuttle.dropoffInputType === "text"}
                                                />
                                            )}
                                            
                                            
                                            <div className="mt-4">
                                                <label className="block font-semibold mb-2 text-blue-700" htmlFor="dropoffNote">Ghi chú (Dropoff)</label>
                                                <input
                                                    id="dropoffNote"
                                                    name="dropoffNote"
                                                    type="text"
                                                    className="custom-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ghi chú cho điểm trả..."
                                                    value={shuttle.dropoffNote}
                                                    onChange={handleShuttleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        type="button" // Đặt type là button để không submit form
                                        onClick={() => setCurrentStep(0)}
                                        className="back-button bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl transition duration-300"
                                        disabled={loading}
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit" // Đặt type là submit để kích hoạt handleBooking qua form
                                        className="book-button font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 text-xl"
                                        disabled={selectedSeats.length === 0 || loading || !form.fullname || !form.phone || !form.email}
                                        style={{
                                            background: "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                                            color: "#fff",
                                            letterSpacing: 1
                                        }}
                                    >
                                        {loading ? "Đang đặt chỗ..." : "Đặt Chỗ"}
                                    </button>
                                </div>
                                {message && currentStep === 1 && ( // Chỉ hiển thị thông báo ở bước 1 nếu có lỗi
                                    <p className="text-red-600 text-center mt-4 font-medium">{message}</p>
                                )}
                            </form>
                        ) : (
                            <p className="text-gray-700 text-center py-6">
                                Form thông tin khách hàng (Tên, SĐT, Email,...) sẽ hiển thị tại đây sau khi bạn đã xác nhận chọn ghế.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatBooking;