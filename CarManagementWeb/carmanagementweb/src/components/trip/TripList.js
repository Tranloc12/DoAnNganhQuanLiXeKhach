import React, { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis.js";
import { useNavigate } from "react-router-dom";


export default function TripList() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadTrips = async () => {
        try {
            const res = await Apis.get(endpoints.trips);
            if (Array.isArray(res.data)) {
                setTrips(res.data);
            } else {
                setTrips([]);
            }
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách chuyến đi:", err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrips();
    }, []);

    const formatDepartureTime = (departureTime) => {
        if (!departureTime) return { time: "N/A", date: "N/A" };
        const [year, month, day, hour, minute] = departureTime;
        const formattedDate = new Date(year, month - 1, day, hour, minute);
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

        return {
            time: formattedDate.toLocaleTimeString('vi-VN', timeOptions),
            date: formattedDate.toLocaleDateString('vi-VN', dateOptions)
        };
    };

    const getStatusTextAndStyle = (status) => {
        switch (status) {
            case 'Scheduled':
                return { text: 'Đã lên lịch', style: styles.statusScheduled };
            case 'Completed':
                return { text: 'Đã hoàn thành', style: styles.statusCompleted };
            case 'Cancelled':
                return { text: 'Đã hủy', style: styles.statusCancelled };
            default:
                return { text: 'Không rõ', style: styles.statusUnknown };
        }
    };

    if (loading) return <p style={styles.loadingMessage}>Đang tải danh sách chuyến đi...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Danh sách Chuyến đi</h2>

            {!trips.length ? (
                <p style={styles.noDataMessage}>🚨 Không có dữ liệu chuyến đi nào để hiển thị.</p>
            ) : (
                <div style={styles.cardGrid}>
                    {trips.map((trip) => {
                        const { time, date } = formatDepartureTime(trip.departureTime);
                        const statusInfo = getStatusTextAndStyle(trip.status);

                        return (
                            <div key={trip.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>{trip.routeName}</h3>
                                    <span style={statusInfo.style}>
                                        {statusInfo.text}
                                    </span>
                                </div>
                                <div style={styles.cardBody}>
                                    <p style={styles.cardDetail}>
                                        <strong style={styles.strongText}>Thời gian khởi hành:</strong> {time} | {date}
                                    </p>
                                    <p style={styles.cardDetail}>
                                        <strong style={styles.strongText}>Giá vé:</strong> {trip.fare?.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                    <p style={styles.cardDetail}>
                                        <strong style={styles.strongText}>Biển số xe:</strong> {trip.busLicensePlate}
                                    </p>
                                    <p style={styles.cardDetail}>
                                        <strong style={styles.strongText}>Tài xế:</strong> {trip.driverName}
                                    </p>
                                    <p style={styles.cardDetail}>
                                        <strong style={styles.strongText}>Số ghế trống:</strong> {trip.availableSeats} / {trip.availableSeats + trip.totalBookedSeats}
                                    </p>
                                </div>
                                <div style={styles.cardFooter}>
                                    <button
                                        style={styles.viewDetailsButton}
                                        onClick={() => navigate(`/book/${trip.id}`)}
                                    >
                                        Đặt vé ngay
                                    </button>
                                    {/* Nút mới để theo dõi vị trí */}
                                    <button
                                        style={styles.trackButton}
                                        onClick={() => navigate(`/trips/${trip.id}/track`)}
                                    >
                                        Theo dõi vị trí 🗺️
                                    </button>
                                    {/* Nút hiện có để xem đánh giá */}
                                    <button
                                        style={styles.viewReviewsButton}
                                        
                                        onClick={() => navigate(`/trips/${trip.id}/reviews`)}
                                    >
                                        Xem Đánh Giá
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Khai báo lại styles với các cập nhật
const styles = {
    container: {
        fontFamily: "'Quicksand', sans-serif",
        padding: '40px',
        maxWidth: '1200px',
        margin: '40px auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    loadingMessage: {
        textAlign: 'center',
        fontSize: '1.4em',
        color: '#6c757d',
        padding: '40px 20px',
        backgroundColor: '#e9ecef',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        fontWeight: '500',
    },
    heading: {
        textAlign: 'center',
        color: '#e75702',
        marginBottom: '50px',
        fontSize: '3.5em',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textShadow: '2px 2px 5px rgba(0,0,0,0.15)',
    },
    noDataMessage: {
        textAlign: 'center',
        fontSize: '1.6em',
        color: '#dc3545',
        padding: '30px',
        backgroundColor: '#fff0f3',
        border: '2px dashed #ffcccb',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontWeight: '600',
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        padding: '30px',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '20px',
    },
    cardTitle: {
        fontSize: '2em',
        color: '#343a40',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '0.02em',
    },
    cardBody: {
        flexGrow: 1,
        marginBottom: '20px',
    },
    cardDetail: {
        fontSize: '1.1em',
        color: '#555',
        marginBottom: '10px',
        lineHeight: '1.6',
    },
    strongText: {
        color: '#343a40',
        fontWeight: '700',
    },
    statusScheduled: {
        color: '#ffffff',
        fontWeight: '600',
        backgroundColor: '#17a2b8',
        padding: '6px 14px',
        borderRadius: '25px',
        fontSize: '0.9em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(23, 162, 184, 0.3)',
    },
    statusCompleted: {
        color: '#ffffff',
        fontWeight: '600',
        backgroundColor: '#28a745',
        padding: '6px 14px',
        borderRadius: '25px',
        fontSize: '0.9em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(40, 167, 69, 0.3)',
    },
    statusCancelled: {
        color: '#ffffff',
        fontWeight: '600',
        backgroundColor: '#dc3545',
        padding: '6px 14px',
        borderRadius: '25px',
        fontSize: '0.9em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(220, 53, 69, 0.3)',
    },
    statusUnknown: {
        color: '#ffffff',
        fontWeight: '600',
        backgroundColor: '#6c757d',
        padding: '6px 14px',
        borderRadius: '25px',
        fontSize: '0.9em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(108, 117, 125, 0.3)',
    },
    cardFooter: {
        marginTop: 'auto',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
        display: 'flex', 
        justifyContent: 'space-between', 
        gap: '10px', 
    },
    viewDetailsButton: {
        backgroundColor: '#e75702',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '1em',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 10px rgba(231, 87, 2, 0.4)',
        flexGrow: 1, 
    },
    viewReviewsButton: {
        backgroundColor: '#0d6efd',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '1em',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 10px rgba(13, 110, 253, 0.4)',
        flexGrow: 1,
    },
    // Thêm style mới cho nút "Theo dõi vị trí"
    trackButton: {
        backgroundColor: '#ff9800',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '1em',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 10px rgba(255, 152, 0, 0.4)',
        flexGrow: 1,
    },
};