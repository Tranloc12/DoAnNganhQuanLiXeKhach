import React, { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis.js";

export default function BusList() {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadBuses = async () => {
        setLoading(true);
        try {
            const res = await Apis.get(endpoints.buses);
            console.log("📌 API trả về raw:", res);

            if (Array.isArray(res.data)) {
                setBuses(res.data);
            } else {
                setBuses([]);
            }
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách xe:", err);
            setBuses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBuses();
    }, []);

    if (loading) return <p style={styles.loadingMessage}>Đang tải danh sách xe...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Danh sách Xe Khách</h2>

            {!Array.isArray(buses) || buses.length === 0 ? (
                <p style={styles.noDataMessage}>🚨 Không có dữ liệu xe khách nào để hiển thị.</p>
            ) : (
                <div style={styles.cardGrid}>
                    {buses.map((bus) => (
                        <div key={bus.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Xe {bus.model}</h3>
                                <span style={bus.status === 'Hoạt động' ? styles.statusActive : styles.statusInactive}>
                                    {bus.status}
                                </span>
                            </div>
                            <div style={styles.cardBody}>
                                <p style={styles.cardDetail}><strong style={styles.strongText}>Biển số:</strong> {bus.licensePlate}</p>
                                <p style={styles.cardDetail}><strong style={styles.strongText}>Sức chứa:</strong> {bus.capacity} chỗ</p>
                                <p style={styles.cardDetail}><strong style={styles.strongText}>Năm sản xuất:</strong> {bus.yearManufacture}</p>
                                <p style={styles.cardDetail}><strong style={styles.strongText}>ID Xe:</strong> {bus.id}</p>
                            </div>
                            <div style={styles.cardFooter}>
                                <button style={styles.viewDetailsButton}>
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        // Sử dụng font 'Quicksand' - một font sans-serif hiện đại, mềm mại và dễ đọc.
        // Cần đảm bảo font này được import vào dự án của bạn (ví dụ: qua Google Fonts)
        fontFamily: "'Quicksand', sans-serif",
        padding: '30px',
        maxWidth: '1200px',
        margin: '20px auto',
        backgroundColor: '#f5f7fa',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    },
    loadingMessage: {
        textAlign: 'center',
        fontSize: '1.4em',
        color: '#6c757d',
        padding: '40px 20px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        fontWeight: '500', // Giữ độ đậm vừa phải
    },
    heading: {
        textAlign: 'center',
        color: '#e75702',
        marginBottom: '40px',
        fontSize: '3.2em', // To hơn một chút để tạo điểm nhấn mạnh mẽ
        fontWeight: '700', // Rất đậm
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Tăng khoảng cách chữ nhẹ để trông thoáng hơn
        textShadow: '1px 1px 4px rgba(0,0,0,0.1)', // Đổ bóng chữ rõ hơn
    },
    noDataMessage: {
        textAlign: 'center',
        fontSize: '1.6em',
        color: '#dc3545',
        padding: '30px',
        backgroundColor: '#fff0f3',
        border: '1px solid #ffcccb',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        fontWeight: '600', // Đậm vừa
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        padding: '25px',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '15px',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '15px',
    },
    cardTitle: {
        fontSize: '2em', // Kích thước tiêu đề card
        color: '#e75702',
        fontWeight: '700', // Đậm hơn
        margin: 0,
        letterSpacing: '0.02em', // Tăng khoảng cách chữ nhẹ cho tiêu đề card
    },
    cardBody: {
        flexGrow: 1,
    },
    cardDetail: {
        fontSize: '1.05em', // Kích thước chữ chi tiết
        color: '#555',
        marginBottom: '8px',
        lineHeight: '1.6', // Tăng khoảng cách dòng để dễ đọc hơn
    },
    strongText: {
        color: '#333',
        fontWeight: '700', // Đậm hơn cho các nhãn
    },
    statusActive: {
        color: '#ffffff',
        fontWeight: '600', // Đậm vừa phải
        backgroundColor: '#28a745',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.85em', // Nhỏ hơn một chút cho trạng thái
        textTransform: 'uppercase',
        letterSpacing: '0.03em', // Khoảng cách chữ cho trạng thái
    },
    statusInactive: {
        color: '#ffffff',
        fontWeight: '600',
        backgroundColor: '#6c757d',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.85em',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
    },
    cardFooter: {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
    },
    viewDetailsButton: {
        backgroundColor: '#e75702',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        padding: '12px 25px',
        fontSize: '1.05em', // Kích thước chữ nút
        fontWeight: '600', // Đậm vừa
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#d64c00',
            transform: 'scale(1.02)',
        },
        '&:active': {
            transform: 'scale(0.98)',
        }
    }
};