import React, { useEffect, useState } from "react"; 
import { Calendar, momentLocalizer } from 'react-big-calendar'; 
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import styled from 'styled-components'; 
import { Alert, Button, Spinner, Modal, Form, Container, Table, Row, Col } from "react-bootstrap"; 
// Link không cần thiết trong view chỉ xem cho tài xế, nhưng giữ lại nếu có thể tái sử dụng ở đâu đó khác
// import { Link } from "react-router-dom";  

import { authApis, endpoints } from "../../configs/Apis"; 
// Giả định bạn có một hàm formatDate trong tiện ích
import { formatDate } from "../../utils/apiUtils";


// Cấu hình localizer cho react-big-calendar 
const localizer = momentLocalizer(moment); 

// Styled-component cho container chính của lịch 
const StyledCalendarContainer = styled.div` 
    margin: 2rem auto; /* Tăng margin để lịch có nhiều không gian hơn */ 
    padding: 2.5rem; /* Tăng padding bên trong */ 
    background: linear-gradient(145deg, #f0f4f7, #ffffff); /* Nền gradient nhẹ nhàng */ 
    border-radius: 20px; /* Bo tròn mạnh hơn */ 
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.08); /* Đổ bóng đa lớp cho chiều sâu */ 
    height: 90vh; /* Tăng nhẹ chiều cao */ 
    max-width: 90%; /* Giảm chiều rộng tối đa một chút để lịch tập trung hơn */ 
    border: 1px solid #e0e6ed; /* Viền mỏng tinh tế */ 
    display: flex; 
    flex-direction: column; 

    .rbc-calendar { 
        flex-grow: 1; /* Lịch chiếm hết không gian còn lại */ 
        font-family: 'Open Sans', 'Inter', sans-serif; /* Sử dụng font phổ biến và dễ đọc */ 
        color: #343a40; /* Màu chữ tối hơn cho độ tương phản tốt */ 
        font-size: 0.95rem; /* Tăng nhẹ kích thước font mặc định */ 
    } 

    /* Tùy chỉnh thanh công cụ (Toolbar) của lịch */ 
    .rbc-toolbar { 
        margin-bottom: 1.8rem; /* Khoảng cách lớn hơn giữa toolbar và lịch */ 
        display: flex; 
        justify-content: center; /* Căn giữa các nút điều hướng */ 
        align-items: center; 

        button { 
            background-color: #6c757d; /* Màu xám than đơn giản */ 
            color: white; 
            border: none; 
            border-radius: 8px; /* Bo tròn các nút */ 
            padding: 0.65rem 1.3rem; /* Tăng padding */ 
            margin: 0 0.45rem; /* Tăng margin giữa các nút */ 
            font-weight: 600; 
            letter-spacing: 0.4px; /* Tăng khoảng cách chữ */ 
            text-transform: uppercase; /* Chữ hoa */ 
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Bóng đổ mềm mại hơn */ 
            transition: all 0.2s ease-in-out; /* Hiệu ứng chuyển động mượt mà */ 

            &:hover { 
                background-color: #5a6268; /* Màu tối hơn khi hover */ 
                transform: translateY(-2px); /* Hiệu ứng nhấc nhẹ rõ hơn */ 
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
            } 
            &:active, &:focus { 
                background-color: #495057;  
                box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.2); /* Focus ring tinh tế */ 
                outline: none; 
            } 
            &.rbc-active { /* Nút xem đang được chọn */ 
                background-color: #007bff; /* Màu xanh dương nổi bật */ 
                box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3); 
            } 
        } 
        .rbc-btn-group { 
            border-radius: 8px; /* Đảm bảo nhóm nút cũng bo tròn */ 
            overflow: hidden; /* Cắt góc thừa nếu có border-radius */ 
        } 
        .rbc-toolbar-label { 
            font-size: 1.7rem; /* Kích thước font cho tiêu đề tháng/tuần */ 
            font-weight: 700; 
            color: #2c3e50; /* Màu tối hơn cho tiêu đề */ 
            text-shadow: 0 1px 2px rgba(0,0,0,0.02); /* Bóng chữ nhẹ hơn */ 
        } 
    } 

    /* Tiêu đề ngày trong lịch (Thứ 2, Thứ 3,...) */ 
    .rbc-header { 
        background-color: #eef2f7; /* Nền xám xanh nhạt */ 
        padding: 0.7rem 0; 
        font-weight: 700; 
        color: #555; 
        border-bottom: 1px solid #dcdfe4; 
        text-transform: uppercase;  
        font-size: 0.88rem; /* Kích thước font lớn hơn một chút */ 
        letter-spacing: 0.5px; 
    } 

    /* Các sự kiện trên lịch */ 
    .rbc-row-segment .rbc-event { 
        border-radius: 8px; /* Bo tròn sự kiện */ 
        background-color: #28a745; /* Màu xanh lá cây đơn giản */ 
        color: white; 
        border: none;  
        font-size: 0.85rem; 
        padding: 5px 8px; /* Tăng padding */ 
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2); /* Bóng đổ mềm mại hơn */ 
        transition: all 0.2s ease-in-out; 
        line-height: 1.3;  
        overflow: hidden;  
        text-overflow: ellipsis;  
        white-space: nowrap;  
        
        &:hover { 
            background-color: #218838; /* Đổi màu khi hover */ 
            transform: scale(1.02) translateY(-2px); /* Phóng to và nhấc lên nhẹ hơn khi hover */ 
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);  
        } 
    } 

    /* Dòng thời gian hiện tại */ 
    .rbc-current-time-indicator { 
        background-color: #ff7f50; /* Màu cam san hô nổi bật */ 
        height: 3px; /* Dày hơn */ 
        border-radius: 2px; /* Bo tròn đầu dòng */ 
    } 

    /* Nền cho các ngày ngoài phạm vi của tháng hiện tại */ 
    .rbc-off-range-bg { 
        background-color: #f7f7f7; /* Nền xám nhạt hơn */ 
    } 

    /* Đường kẻ phân chia slot thời gian */ 
    .rbc-time-slot { 
        border-top: 1px dashed #e5e5e5; /* Đường kẻ mảnh và mờ hơn */ 
    } 
    .rbc-time-content > * + * > hr { 
        border-color: #e5e5e5;  
    } 

    /* Cải thiện giao diện Modal */ 
    .modal-content { 
        border-radius: 18px; /* Bo tròn hơn cho modal */ 
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2); /* Bóng đổ mềm mại hơn */ 
        overflow: hidden;  
    } 
    .modal-header { 
        border-bottom: 1px solid #e5e5e5; 
        background-color: #f8f9fa; /* Nền đơn giản cho header modal */ 
        border-top-left-radius: 18px; 
        border-top-right-radius: 18px; 
        font-weight: 700; 
        color: #343a40; 
        padding: 1.2rem 1.8rem; /* Tăng padding */ 
        font-size: 1.2rem; 
    } 
    .modal-body { 
        padding: 2.2rem; /* Tăng padding trong body */ 
        color: #495057; 
    } 
    .modal-footer { 
        border-top: 1px solid #e5e5e5; 
        padding: 1.2rem 2.2rem; 
    } 

    /* Nút trong Modal */ 
    .modal-footer .btn { 
        border-radius: 8px; 
        padding: 0.7rem 1.4rem; /* Tăng padding */ 
        font-weight: 600; 
        transition: all 0.2s ease-out; /* Thêm transition */ 
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Bóng đổ mềm mại hơn */ 

        &:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
        } 
    } 
    /* Các màu nút cụ thể */ 
    .modal-footer .btn-primary { 
        background-color: #007bff; 
        border-color: #007bff; 
        &:hover { background-color: #0056b3; border-color: #004085; } 
    } 
    .modal-footer .btn-danger { 
        background-color: #dc3545; 
        border-color: #dc3545; 
        &:hover { background-color: #c82333; border-color: #bd2130; } 
    } 
    .modal-footer .btn-warning { 
        background-color: #ffc107; 
        border-color: #ffc107; 
        color: #212529;  
        &:hover { background-color: #e0a800; border-color: #d39e00; } 
    } 
    .modal-footer .btn-secondary { 
        background-color: #6c757d; 
        border-color: #6c757d; 
        &:hover { background-color: #5a6268; border-color: #545b62; } 
    } 

    /* Style cho Spinner và Alert */ 
    .spinner-border { 
        color: #007bff !important;  
    } 
    .alert-danger { 
        border-radius: 10px; 
        box-shadow: 0 4px 10px rgba(220, 53, 69, 0.1); /* Bóng đổ nhẹ hơn */ 
        font-weight: 500; 
    } 
`; 

// Component Modal tùy chỉnh cho thông báo (ví dụ: lỗi, thành công)
const AlertDialog = ({ show, handleClose, message }) => { 
    return ( 
        <Modal show={show} onHide={handleClose} centered> 
            <Modal.Header closeButton> 
                <Modal.Title>Thông báo</Modal.Title> 
            </Modal.Header> 
            <Modal.Body>{message}</Modal.Body> 
            <Modal.Footer> 
                <Button variant="primary" onClick={handleClose}> 
                    Đóng 
                </Button> 
            </Modal.Footer> 
        </Modal> 
    ); 
}; 

// Modal hiển thị chi tiết sự kiện (chỉ dành cho tài xế: chỉ xem)
const EventDetailModal = ({ show, handleClose, event }) => { 
    if (!event) return null; 

    return ( 
        <Modal show={show} onHide={handleClose} centered> 
            <Modal.Header closeButton> 
                <Modal.Title>Chi tiết lịch trình của tôi</Modal.Title> 
            </Modal.Header> 
            <Modal.Body> 
                <p><strong>ID:</strong> {event.id}</p> 
                <p><strong>Chuyến đi:</strong> {event.tripName}</p> 
                <p><strong>Xe buýt:</strong> {event.busLicensePlate}</p> 
                <p><strong>Tài xế:</strong> {event.driverUsername}</p> 
                {/* Định dạng thời gian 24 giờ cho hiển thị chi tiết sự kiện */}
                <p><strong>Bắt đầu:</strong> {moment(event.start).format('DD/MM/YYYY HH:mm')}</p> 
                <p><strong>Kết thúc:</strong> {moment(event.end).format('DD/MM/YYYY HH:mm')}</p> 
            </Modal.Body> 
            <Modal.Footer> 
                <Button variant="secondary" onClick={handleClose}>Đóng</Button> 
            </Modal.Footer> 
        </Modal> 
    ); 
}; 

// Component chính Lịch trình của Tài xế (DriverSchedule)
const DriverSchedule = () => { 
    const [events, setEvents] = useState([]); 
    const [loading, setLoading] = useState(false); // Đặt ban đầu là false
    const [error, setError] = useState(null); 
    const [currentDate, setCurrentDate] = useState(new Date()); 

    const [showAlertDialog, setShowAlertDialog] = useState(false); 
    const [alertMessage, setAlertMessage] = useState(""); 

    const [showEventModal, setShowEventModal] = useState(false); 
    const [selectedEvent, setSelectedEvent] = useState(null); 

    // States để quản lý form tạo thông tin tài xế
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [driverInfo, setDriverInfo] = useState({
        height: 170, // Giá trị mặc định
        weight: 70,  // Giá trị mặc định
        goal: "Hoàn thành chuyến đi đúng giờ" // Mục tiêu mặc định
    });

    const fetchSchedules = async () => { 
        setLoading(true); 
        setError(null); // Reset lỗi trước mỗi lần fetch
        try { 
            // Giả định authApis đã tự động gửi token xác thực, backend sẽ lọc theo tài xế
            let res = await authApis().get(endpoints.schedules, {
                // Kèm theo FormData rỗng và header nếu backend yêu cầu như MemberProgress
                // Thông thường GET không cần body multipart/form-data
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }); 
            console.log("✅ Dữ liệu lịch trình gốc từ API (Driver):", res.data); 

            if (!Array.isArray(res.data)) { 
                const errorMessage = res.data?.detail || res.data || "Lỗi khi tải lịch trình";
                console.error("❌ Dữ liệu API không phải là mảng hoặc lỗi:", errorMessage);

                // Kiểm tra nếu lỗi báo thiếu thông tin tài xế
                if (typeof errorMessage === 'string' && errorMessage.includes('Thông tin tài xế chưa được tạo')) {
                    setError("Thông tin tài xế của bạn chưa được tạo. Vui lòng tạo thông tin tài xế để xem lịch trình.");
                    setShowCreateForm(true); // Hiển thị form tạo thông tin
                } else {
                    setError(errorMessage);
                }
                setEvents([]); 
                return; 
            } 
            
            const mappedEvents = res.data.map((s) => ({ 
                id: s.id, 
                title: `${s.tripId?.routeId?.routeName || 'Tuyến không xác định'} - Xe ${s.busId?.licensePlate || 'Không rõ'} - TX: ${s.driverId?.userId?.username || 'Không rõ'}`, 
                start: new Date(s.startTime), 
                end: new Date(s.endTime), 
                tripName: s.tripId?.routeId?.routeName || 'N/A', 
                busLicensePlate: s.busId?.licensePlate || 'N/A', 
                driverUsername: s.driverId?.userId?.username || 'N/A', 
            })); 
            setEvents(mappedEvents); 
            setShowCreateForm(false); // Đảm bảo form tạo ẩn nếu tải thành công
        } catch (err) { 
            console.error("❌ Lỗi khi tải lịch trình:", err); 
            let errorMessage = "Không thể tải danh sách lịch trình. Vui lòng kiểm tra kết nối và trạng thái đăng nhập.";
            if (err.response && err.response.data) {
                const apiError = err.response.data;
                if (typeof apiError === 'string' && apiError.includes('Thông tin tài xế chưa được tạo')) {
                    errorMessage = "Thông tin tài xế của bạn chưa được tạo. Vui lòng tạo thông tin tài xế để xem lịch trình.";
                    setShowCreateForm(true); // Hiển thị form tạo thông tin
                } else {
                    errorMessage = apiError.detail || apiError || errorMessage; // Lấy chi tiết lỗi từ API
                }
            }
            setError(errorMessage);
            setEvents([]);
        } finally { 
            setLoading(false); 
        } 
    }; 

    // Effect để tải lịch trình khi component mount
    useEffect(() => { 
        fetchSchedules(); 
    }, []); // Chạy một lần khi component mount

    const handleSelectEvent = (event) => { 
        setSelectedEvent(event); 
        setShowEventModal(true); 
    }; 

    // Tài xế không được phép chọn slot để thêm lịch trình
    const handleSelectSlot = ({ start, end }) => { 
        setAlertMessage("❌ Bạn không có quyền thêm lịch trình."); 
        setShowAlertDialog(true); 
    }; 

    // Hàm xử lý khi tài xế tạo thông tin của mình
    const handleCreateDriverInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('height', driverInfo.height);
            formData.append('weight', driverInfo.weight);
            formData.append('goal', driverInfo.goal);

            // Giả định có một endpoint để tạo thông tin tài xế
            await authApis().post(endpoints['create-driver-info'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAlertMessage("✅ Tạo thông tin tài xế thành công!");
            setShowAlertDialog(true);
            setShowCreateForm(false);
            
            // Sau khi tạo thành công, tải lại lịch trình
            fetchSchedules(); 
            // Hoặc có thể dùng window.location.reload(); như ví dụ MemberProgress
            // window.location.reload(); 
        } catch (err) {
            console.error("Error creating driver info:", err);
            setError("Lỗi khi tạo thông tin tài xế: " + (err.response?.data?.detail || err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <Container className="mt-4">
            <h2 className="mb-4">Lịch trình của tôi</h2> 

            {loading ? ( 
                <div className="text-center my-5"> 
                    <Spinner animation="border" variant="primary" role="status"> 
                        <span className="visually-hidden">Đang tải...</span> 
                    </Spinner> 
                    <p className="text-muted mt-3">Đang tải lịch trình của bạn...</p> 
                </div> 
            ) : error ? ( 
                <div>
                    <Alert variant="danger" className="mx-auto" style={{ maxWidth: '800px' }}>
                        {error}
                        {error.includes('Thông tin tài xế chưa được tạo') && (
                            <div className="mt-3">
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateForm(true)}
                                    disabled={loading}
                                >
                                    Tạo thông tin tài xế
                                </Button>
                            </div>
                        )}
                    </Alert>
                    {showCreateForm && (
                        <Alert variant="info" className="mt-3">
                            <h5>Tạo thông tin tài xế</h5>
                            <Form onSubmit={handleCreateDriverInfo}>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chiều cao (cm)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={driverInfo.height}
                                                onChange={(e) => setDriverInfo({ ...driverInfo, height: e.target.value })}
                                                min="100"
                                                max="250"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cân nặng (kg)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={driverInfo.weight}
                                                onChange={(e) => setDriverInfo({ ...driverInfo, weight: e.target.value })}
                                                min="30"
                                                max="200"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mục tiêu</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={driverInfo.goal}
                                                onChange={(e) => setDriverInfo({ ...driverInfo, goal: e.target.value })}
                                                placeholder="Ví dụ: Hoàn thành chuyến đi đúng giờ"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="success" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo thông tin'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowCreateForm(false)}
                                        disabled={loading}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </Form>
                        </Alert>
                    )}
                </div>
            ) : events.length === 0 && !showCreateForm ? ( // Chỉ hiển thị nếu không có lỗi và không phải đang hiển thị form tạo
                <Alert variant="info">Bạn chưa có lịch trình nào được phân công.</Alert>
            ) : ( 
                <StyledCalendarContainer> 
                    <Calendar 
                        localizer={localizer} 
                        events={events} 
                        startAccessor="start" 
                        endAccessor="end" 
                        defaultView="week" 
                        views={["week", "day", "month"]} 
                        selectable={false} // Tài xế không được phép chọn slot
                        resizable={false} // Tài xế không được phép thay đổi kích thước sự kiện
                        date={currentDate} 
                        onNavigate={setCurrentDate} 
                        min={new Date(new Date().setHours(0, 0, 0, 0))} // Bắt đầu từ 00:00 
                        max={new Date(new Date().setHours(23, 59, 59, 999))} // Kết thúc tại 23:59:59 
                        step={60} 
                        timeslots={1} 
                        onSelectSlot={handleSelectSlot} // Xử lý khi tài xế cố gắng chọn slot
                        onSelectEvent={handleSelectEvent} 
                        formats={{ 
                            timeGutterFormat: 'HH:mm',
                            eventTimeRangeFormat: ({ start, end }) => 
                                `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                            agendaTimeFormat: 'HH:mm',
                            agendaTimeRangeFormat: ({ start, end }) => 
                                `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                            selectRangeFormat: ({ start, end }) => 
                                `${moment(start).format('DD/MM/YYYY HH:mm')} - ${moment(end).format('DD/MM/YYYY HH:mm')}`
                        }}
                    /> 
                </StyledCalendarContainer> 
            )} 

            {/* Modal: Chi tiết lịch trình (chỉ xem, không nút xóa/sửa) */} 
            <EventDetailModal 
                show={showEventModal} 
                handleClose={() => setShowEventModal(false)} 
                event={selectedEvent} 
            /> 

            {/* Modal: Thông báo (ví dụ: không có quyền) */} 
            <AlertDialog 
                show={showAlertDialog} 
                handleClose={() => setShowAlertDialog(false)} 
                message={alertMessage} 
            /> 
        </Container> 
    ); 
 }; 

 export default DriverSchedule;
