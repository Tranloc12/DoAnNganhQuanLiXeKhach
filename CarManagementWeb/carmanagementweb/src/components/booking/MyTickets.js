import React, { useState, useEffect } from 'react';
import { authApis } from '../../configs/Apis';
import './MyTickets.css';

const StatusBadge = ({ status }) => {
    const map = {
        'COMPLETED': { label: '✅ Đã thanh toán', cls: 'status-paid' },
        'PAID': { label: '✅ Đã thanh toán', cls: 'status-paid' },
        'PENDING': { label: '⏳ Chờ thanh toán', cls: 'status-pending' },
        'CANCELLED': { label: '❌ Đã hủy', cls: 'status-cancelled' },
    };
    const s = map[status?.toUpperCase()] || { label: status || 'Không rõ', cls: 'status-unknown' };
    return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
};

export default function MyTickets() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        setLoading(true);
        try {
            const res = await authApis().get('/bookings/my');
            setBookings(res.data || []);
        } catch (err) {
            setMessage('Lỗi khi tải danh sách vé. Vui lòng đăng nhập lại.');
        } finally {
            setLoading(false);
        }
    };

    const openQrModal = async (booking) => {
        setSelectedBooking(booking);
        setQrData(null);
        setQrLoading(true);
        try {
            const res = await authApis().get(`/qr/booking/${booking.id}`);
            setQrData(res.data);
        } catch (err) {
            setMessage('Không thể tải QR code. Vui lòng thử lại.');
        } finally {
            setQrLoading(false);
        }
    };

    const downloadQr = () => {
        if (!qrData?.qrCode) return;
        const link = document.createElement('a');
        link.href = qrData.qrCode;
        link.download = `ve-xe-${selectedBooking?.id}.png`;
        link.click();
    };

    const printTicket = () => {
        window.print();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleString('vi-VN');
        } catch { return dateStr; }
    };

    const formatVND = (amount) => new Intl.NumberFormat('vi-VN', {
        style: 'currency', currency: 'VND'
    }).format(amount || 0);

    if (loading) return (
        <div className="tickets-loading">
            <div className="spinner"></div>
            <p>Đang tải vé của bạn...</p>
        </div>
    );

    return (
        <div className="my-tickets">
            <div className="tickets-header">
                <h1 className="tickets-title">🎫 Vé Của Tôi</h1>
                <p className="tickets-subtitle">{bookings.length} vé đã đặt</p>
            </div>

            {message && <div className="tickets-message">{message}</div>}

            {bookings.length === 0 ? (
                <div className="no-tickets">
                    <div className="no-tickets-icon">🚌</div>
                    <h3>Bạn chưa đặt vé nào</h3>
                    <p>Hãy khám phá các chuyến xe và đặt ngay!</p>
                    <a href="/trips" className="explore-btn">Tìm chuyến xe</a>
                </div>
            ) : (
                <div className="tickets-grid">
                    {bookings.map(booking => (
                        <div key={booking.id} className={`ticket-card ${booking.paymentStatus?.toUpperCase() === 'COMPLETED' || booking.paymentStatus?.toUpperCase() === 'PAID' ? 'ticket-paid' : ''}`}>
                            {/* Ticket Header */}
                            <div className="ticket-header">
                                <div className="ticket-id">VÉ #{booking.id}</div>
                                <StatusBadge status={booking.paymentStatus} />
                            </div>

                            {/* Route Info */}
                            <div className="ticket-route">
                                <div className="route-point">
                                    <span className="route-dot route-from"></span>
                                    <span>{booking.tripId?.routeId?.origin || 'Điểm đi'}</span>
                                </div>
                                <div className="route-line">──────── 🚌 ────────</div>
                                <div className="route-point">
                                    <span className="route-dot route-to"></span>
                                    <span>{booking.tripId?.routeId?.destination || 'Điểm đến'}</span>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="ticket-details">
                                <div className="detail-row">
                                    <span className="detail-label">🗓️ Ngày đặt</span>
                                    <span className="detail-value">{formatDate(booking.bookingDate)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">🪑 Số ghế</span>
                                    <span className="detail-value">{booking.seatNumbers || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">👥 Số lượng</span>
                                    <span className="detail-value">{booking.numberOfSeats} ghế</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">💰 Tổng tiền</span>
                                    <span className="detail-value price">{formatVND(booking.totalAmount)}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="ticket-divider">
                                <div className="divider-notch left"></div>
                                <div className="divider-line"></div>
                                <div className="divider-notch right"></div>
                            </div>

                            {/* Actions */}
                            <div className="ticket-actions">
                                <button className="btn-qr" onClick={() => openQrModal(booking)}>
                                    📱 Xem QR Code
                                </button>
                                <button className="btn-track" onClick={() => window.location.href = `/track/${booking.tripId?.id}`}>
                                    🗺️ Theo dõi xe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Modal */}
            {selectedBooking && (
                <div className="qr-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}>
                    <div className="qr-modal">
                        <button className="modal-close" onClick={() => setSelectedBooking(null)}>✕</button>

                        <div className="modal-header">
                            <h2>🎫 Vé Điện Tử</h2>
                            <p>Vé #{selectedBooking.id}</p>
                        </div>

                        <div className="modal-qr-section">
                            {qrLoading ? (
                                <div className="qr-loading"><div className="spinner"></div><p>Đang tạo QR...</p></div>
                            ) : qrData ? (
                                <>
                                    <div className="qr-container">
                                        <img src={qrData.qrCode} alt="QR Code vé" className="qr-image" />
                                        <div className="qr-glow"></div>
                                    </div>
                                    <p className="qr-instruction">📲 Xuất trình QR này khi lên xe</p>
                                </>
                            ) : (
                                <div className="qr-error">❌ Không thể tải QR. Thử lại sau.</div>
                            )}
                        </div>

                        <div className="modal-details">
                            <div className="modal-detail-row">
                                <span>Số ghế:</span>
                                <strong>{selectedBooking.seatNumbers}</strong>
                            </div>
                            <div className="modal-detail-row">
                                <span>Số lượng:</span>
                                <strong>{selectedBooking.numberOfSeats} ghế</strong>
                            </div>
                            <div className="modal-detail-row">
                                <span>Tổng tiền:</span>
                                <strong className="price">{formatVND(selectedBooking.totalAmount)}</strong>
                            </div>
                            <div className="modal-detail-row">
                                <span>Trạng thái:</span>
                                <StatusBadge status={selectedBooking.paymentStatus} />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-download" onClick={downloadQr} disabled={!qrData}>
                                ⬇️ Tải QR
                            </button>
                            <button className="btn-print" onClick={printTicket}>
                                🖨️ In vé
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
