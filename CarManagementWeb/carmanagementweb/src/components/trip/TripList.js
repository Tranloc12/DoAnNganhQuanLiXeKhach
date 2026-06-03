import React, { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis.js";
import { useNavigate } from "react-router-dom";

export default function TripList() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredTripId, setHoveredTripId] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTrips, setTotalTrips] = useState(0);
    const pageSize = 5; 

    const loadTrips = async (page) => {
        setLoading(true);
        try {
            // Tạm thời gán giá trị cố định để kiểm tra phân trang
            setTotalTrips(20);

            const res = await Apis.get(`${endpoints.trips}?page=${page}&pageSize=${pageSize}`);
            if (Array.isArray(res.data)) {
                setTrips(res.data);
            } else {
                setTrips([]);
                console.error("❌ Lỗi: Dữ liệu chuyến đi không phải là mảng.", res.data);
            }
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách chuyến đi:", err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrips(currentPage);
    }, [currentPage]);

    const formatTimeArray = (timeArray) => {
        if (!timeArray) return { time: "N/A", date: "N/A" };
        const [year, month, day, hour, minute] = timeArray;
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

    const renderPagination = () => {
        const totalPages = Math.ceil(totalTrips / pageSize);
        // Log để kiểm tra giá trị totalPages
        console.log("Tổng số trang:", totalPages);
        
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return (
            <div style={styles.paginationContainer}>
                {pages.map(page => (
                    <button
                        key={page}
                        style={page === currentPage ? styles.paginationButtonActive : styles.paginationButton}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <p style={styles.loadingMessage}>Đang tải danh sách chuyến đi...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Danh sách Chuyến đi</h2>

            {!trips.length ? (
                <div style={styles.noDataMessageBox}>
                    <p style={styles.noDataMessage}>🚨 Không có dữ liệu chuyến đi nào để hiển thị.</p>
                </div>
            ) : (
                <>
                    <div style={styles.cardGrid}>
                        {trips.map((trip) => {
                            const statusInfo = getStatusTextAndStyle(trip.status);
                            const { time, date } = formatTimeArray(trip.departureTime);
                            const { time: endTime, date: endDate } = formatTimeArray(trip.arrivalTime);
                            const cardStyle = hoveredTripId === trip.id ? { ...styles.card, ...styles.cardHover } : styles.card;

                            return (
                                <div
                                    key={trip.id}
                                    style={cardStyle}
                                    onMouseEnter={() => setHoveredTripId(trip.id)}
                                    onMouseLeave={() => setHoveredTripId(null)}
                                >
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
                                            <strong style={styles.strongText}>Thời gian Đến:</strong> {endTime} | {endDate}
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
                                        <p style={styles.cardDetail}>
                                            <strong style={styles.strongText}>Bến xuất phát:</strong> {trip.originStationName}
                                        </p>
                                        <p style={styles.cardDetail}>
                                            <strong style={styles.strongText}>Bến đến:</strong> {trip.destinationStationName}
                                        </p>
                                    </div>
                                    <div style={styles.cardFooter}>
                                        <button
                                            style={styles.outlineButton}
                                            onClick={() => navigate(`/book/${trip.id}`)}
                                        >
                                            Đặt vé ngay
                                        </button>
                                        <button
                                            style={styles.outlineSuccessButton}
                                            onClick={() => navigate(`/trips/${trip.id}/track`)}
                                        >
                                            Theo dõi vị trí 🗺️
                                        </button>
                                        <button
                                            style={styles.outlineDangerButton}
                                            onClick={() => navigate(`/trips/${trip.id}/reviews`)}
                                        >
                                            Xem Đánh Giá
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {renderPagination()}
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Inter', sans-serif",
        padding: '40px',
        maxWidth: '1200px',
        margin: '40px auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#e9ecef',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        fontWeight: '500',
    },
    loadingMessage: {
        fontSize: '1.4em',
        color: '#6c757d',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '50px',
        fontSize: '2.8em',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textShadow: '1px 1px 3px rgba(0,0,0,0.08)',
    },
    noDataMessageBox: {
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#fff0f3',
        border: '2px dashed #ffcccb',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontWeight: '600',
    },
    noDataMessage: {
        fontSize: '1.6em',
        color: '#dc3545',
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '2px solid transparent', 
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        padding: '30px',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardHover: { 
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        border: '2px solid #e75702', 
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
        fontSize: '1.6em',
        color: '#343a40',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '0.01em',
    },
    cardBody: {
        flexGrow: 1,
        marginBottom: '20px',
    },
    cardDetail: {
        fontSize: '1em',
        color: '#555',
        marginBottom: '10px',
        lineHeight: '1.6',
    },
    strongText: {
        color: '#343a40',
        fontWeight: '600',
    },
    statusScheduled: {
        color: '#ffffff',
        fontWeight: '500',
        backgroundColor: '#4a90e2',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.8em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(74, 144, 226, 0.3)',
    },
    statusCompleted: {
        color: '#ffffff',
        fontWeight: '500',
        backgroundColor: '#7ed321',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.8em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(126, 211, 33, 0.3)',
    },
    statusCancelled: {
        color: '#ffffff',
        fontWeight: '500',
        backgroundColor: '#d0021b',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.8em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(208, 2, 27, 0.3)',
    },
    statusUnknown: {
        color: '#ffffff',
        fontWeight: '500',
        backgroundColor: '#9b9b9b',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.8em',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 5px rgba(155, 155, 155, 0.3)',
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
    outlineButton: {
        backgroundColor: 'transparent',
        border: '2px solid #e75702',
        color: '#e75702',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '0.9em',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        flexGrow: 1,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: '#e75702',
            color: '#fff',
        },
    },
    outlineSuccessButton: {
        backgroundColor: 'transparent',
        border: '2px solid #28a745',
        color: '#28a745',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '0.9em',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        flexGrow: 1,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: '#28a745',
            color: '#fff',
        },
    },
    outlineDangerButton: {
        backgroundColor: 'transparent',
        border: '2px solid #dc3545',
        color: '#dc3545',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '0.9em',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        flexGrow: 1,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: '#dc3545',
            color: '#fff',
        },
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px',
        gap: '10px',
    },
    paginationButton: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        color: '#555',
        borderRadius: '8px',
        padding: '10px 15px',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#f0f0f0',
            borderColor: '#bbb',
        },
    },
    paginationButtonActive: {
        backgroundColor: '#e75702',
        border: '1px solid #e75702',
        color: '#fff',
        borderRadius: '8px',
        padding: '10px 15px',
        fontSize: '1em',
        fontWeight: 'bold',
        cursor: 'default',
        boxShadow: '0 4px 10px rgba(231, 87, 2, 0.4)',
    },
};
