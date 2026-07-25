import React, { useEffect, useState } from "react"; 
import { Calendar, momentLocalizer } from 'react-big-calendar'; 
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import styled from 'styled-components'; 
import { Alert, Button, Spinner, Modal, Form } from "react-bootstrap"; 
import { Link } from "react-router-dom";  

import { authApis, endpoints } from "../../configs/Apis"; 

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

// Component Modal tùy chỉnh cho xác nhận 
const ConfirmationModal = ({ show, handleClose, handleConfirm, message }) => { 
    return ( 
        <Modal show={show} onHide={handleClose} centered> 
            <Modal.Header closeButton> 
                <Modal.Title>Xác nhận</Modal.Title> 
            </Modal.Header> 
            <Modal.Body>{message}</Modal.Body> 
            <Modal.Footer> 
                <Button variant="secondary" onClick={handleClose}> 
                    Hủy 
                </Button> 
                <Button variant="danger" onClick={handleConfirm}> 
                    Xác nhận 
                </Button> 
            </Modal.Footer> 
        </Modal> 
    ); 
}; 

// Component Modal tùy chỉnh cho thông báo 
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

// Modal hiển thị chi tiết sự kiện và tùy chọn xóa 
const EventDetailModal = ({ show, handleClose, event, onDelete }) => { 
    if (!event) return null; 

    return ( 
        <Modal show={show} onHide={handleClose} centered> 
            <Modal.Header closeButton> 
                <Modal.Title>Chi tiết lịch trình</Modal.Title> 
            </Modal.Header> 
            <Modal.Body> 
                <p><strong>ID:</strong> {event.id}</p> 
                <p><strong>Chuyến đi:</strong> {event.tripName}</p> 
                <p><strong>Xe buýt:</strong> {event.busLicensePlate}</p> 
                <p><strong>Tài xế:</strong> {event.driverUsername}</p> 
                <p><strong>Bắt đầu:</strong> {moment(event.start).format('DD/MM/YYYY HH:mm')}</p> 
                <p><strong>Kết thúc:</strong> {moment(event.end).format('DD/MM/YYYY HH:mm')}</p> 
            </Modal.Body> 
            <Modal.Footer> 
                <Button variant="danger" onClick={() => onDelete(event.id)}>Xóa lịch trình</Button> 
                <Link to={`/manager/schedules/edit/${event.id}`}> 
                    <Button variant="warning" className="ms-2">Sửa lịch trình</Button> 
                </Link> 
                <Button variant="secondary" onClick={handleClose}>Đóng</Button> 
            </Modal.Footer> 
        </Modal> 
    ); 
}; 

// Modal để thêm lịch trình mới khi người dùng chọn một slot trên lịch 
const AddScheduleModal = ({ show, handleClose, initialStart, initialEnd, onScheduleAdded }) => { 
    const [trips, setTrips] = useState([]); 
    const [buses, setBuses] = useState([]); 
    const [drivers, setDrivers] = useState([]); 
    const [routes, setRoutes] = useState([]);  
    const [formData, setFormData] = useState({ 
        tripId: '', 
        busId: '', 
        driverId: '', 
        routeId: '',  
        note: '' 
    }); 
    const [modalLoading, setModalLoading] = useState(true); 
    const [modalError, setModalError] = useState(null); 

    // Thêm state cục bộ để quản lý thời gian có thể chỉnh sửa 
    const [editableStart, setEditableStart] = useState(initialStart); 
    const [editableEnd, setEditableEnd] = useState(initialEnd); 

    // Cập nhật state cục bộ khi props initialStart/initialEnd thay đổi 
    useEffect(() => { 
        setEditableStart(initialStart); 
        setEditableEnd(initialEnd); 
    }, [initialStart, initialEnd]); 

    useEffect(() => { 
        const fetchDropdownData = async () => { 
            setModalLoading(true); 
            try { 
                const [tripsRes, busesRes, driversRes, routesRes] = await Promise.all([  
                    authApis().get(endpoints.trips), 
                    authApis().get(endpoints.buses), 
                    authApis().get(endpoints.drivers), 
                    authApis().get(endpoints.routes)  
                ]); 

                if (Array.isArray(tripsRes.data)) setTrips(tripsRes.data); 
                if (Array.isArray(busesRes.data)) setBuses(busesRes.data); 
                if (Array.isArray(driversRes.data)) setDrivers(driversRes.data); 
                if (Array.isArray(routesRes.data)) setRoutes(routesRes.data);  

                setFormData(prev => ({ 
                    ...prev, 
                    tripId: tripsRes.data.length > 0 ? tripsRes.data[0].id.toString() : '', 
                    busId: busesRes.data.length > 0 ? busesRes.data[0].id.toString() : '', 
                    driverId: driversRes.data.length > 0 ? driversRes.data[0].id.toString() : '', 
                    routeId: routesRes.data.length > 0 ? routesRes.data[0].id.toString() : ''  
                })); 

            } catch (err) { 
                console.error("Lỗi khi tải dữ liệu dropdown:", err); 
                setModalError("Không thể tải dữ liệu cần thiết cho form. Vui lòng thử lại."); 
            } finally { 
                setModalLoading(false); 
            } 
        }; 
        fetchDropdownData(); 
    }, []); 

    const handleChange = (e) => { 
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value })); 
    }; 

    const handleSubmit = async () => { 
        setModalLoading(true); 
        try { 
            const dataToSubmit = { 
                startTime: moment(editableStart).format('YYYY-MM-DDTHH:mm:ss'), // Sử dụng editableStart 
                endTime: moment(editableEnd).format('YYYY-MM-DDTHH:mm:ss'),     // Sử dụng editableEnd 
                tripId: { id: parseInt(formData.tripId) },     
                busId: { id: parseInt(formData.busId) },       
                driverId: { id: parseInt(formData.driverId) }, 
                routeId: { id: parseInt(formData.routeId) },   
                note: formData.note, 
                shiftType: 'Morning', // Có thể thêm dropdown cho shiftType 
                status: 'Scheduled',  // Có thể thêm dropdown cho status 
            }; 

            await authApis().post(endpoints.schedules, dataToSubmit);  

            onScheduleAdded();  
            handleClose();  
            setModalError(null);  
        } catch (err) { 
            console.error("❌ Lỗi khi thêm lịch trình:", err); 
            if (err.response && err.response.data) { 
                setModalError(`Không thể thêm lịch trình: ${err.response.data.message || err.response.data}`); 
            } else { 
                setModalError("Không thể thêm lịch trình. Vui lòng kiểm tra lại thông tin và thử lại."); 
            } 
        } finally { 
            setModalLoading(false); 
        } 
    }; 

    return ( 
        <Modal show={show} onHide={handleClose} centered> 
            <Modal.Header closeButton> 
                <Modal.Title>Thêm lịch trình mới</Modal.Title> 
            </Modal.Header> 
            <Modal.Body> 
                {modalLoading ? ( 
                    <div className="text-center my-3"> 
                        <Spinner animation="border" size="sm" /> 
                        <p className="text-muted mt-2">Đang tải dữ liệu...</p> 
                    </div> 
                ) : modalError ? ( 
                    <Alert variant="danger">{modalError}</Alert> 
                ) : ( 
                    <Form> 
                        <Form.Group className="mb-3"> 
                            <Form.Label>Thời gian bắt đầu</Form.Label> 
                            <Form.Control 
                                type="datetime-local" // Cho phép chọn ngày và giờ 
                                value={moment(editableStart).format('YYYY-MM-DDTHH:mm')} 
                                onChange={(e) => setEditableStart(new Date(e.target.value))} 
                            /> 
                        </Form.Group> 
                        <Form.Group className="mb-3"> 
                            <Form.Label>Thời gian kết thúc</Form.Label> 
                            <Form.Control 
                                type="datetime-local" // Cho phép chọn ngày và giờ 
                                value={moment(editableEnd).format('YYYY-MM-DDTHH:mm')} 
                                onChange={(e) => setEditableEnd(new Date(e.target.value))} 
                            /> 
                        </Form.Group> 
                        
                        <Form.Group className="mb-3"> 
                            <Form.Label>Tuyến đường</Form.Label> 
                            <Form.Select name="routeId" value={formData.routeId} onChange={handleChange}> 
                                {routes.length > 0 ? ( 
                                    routes.map(route => ( 
                                        <option key={route.id} value={route.id}> 
                                            {route.routeName} ({route.origin} - {route.destination}) 
                                        </option> 
                                    )) 
                                ) : ( 
                                    <option value="">Không có tuyến đường nào</option> 
                                )} 
                            </Form.Select> 
                        </Form.Group> 

                        <Form.Group className="mb-3"> 
                            <Form.Label>Chuyến đi</Form.Label> 
                            <Form.Select name="tripId" value={formData.tripId} onChange={handleChange}> 
                                {trips.length > 0 ? ( 
                                    trips.map(trip => { 
                                        const associatedRoute = routes.find(r => r.id === trip.routeId);  
                                        const displayRouteName = associatedRoute ? associatedRoute.routeName : 'Tuyến không xác định'; 
                                        return ( 
                                            <option key={trip.id} value={trip.id}> 
                                                {trip.id} - {displayRouteName} 
                                            </option> 
                                        ); 
                                    }) 
                                ) : ( 
                                    <option value="">Không có chuyến đi nào</option> 
                                )} 
                            </Form.Select> 
                        </Form.Group> 
                        <Form.Group className="mb-3"> 
                            <Form.Label>Xe buýt</Form.Label> 
                            <Form.Select name="busId" value={formData.busId} onChange={handleChange}> 
                                {buses.length > 0 ? ( 
                                    buses.map(bus => ( 
                                        <option key={bus.id} value={bus.id}> 
                                            {bus.licensePlate} ({bus.model}) 
                                        </option> 
                                    )) 
                                ) : ( 
                                    <option value="">Không có xe buýt nào</option> 
                                )} 
                            </Form.Select> 
                        </Form.Group> 
                        <Form.Group className="mb-3"> 
                            <Form.Label>Tài xế</Form.Label> 
                            <Form.Select name="driverId" value={formData.driverId} onChange={handleChange}> 
                                {drivers.length > 0 ? ( 
                                    drivers.map(driver => ( 
                                        <option key={driver.id} value={driver.id}> 
                                            {driver.userId?.username || `Tài xế ID: ${driver.id}`} 
                                        </option> 
                                    )) 
                                ) : ( 
                                    <option value="">Không có tài xế nào</option> 
                                )} 
                            </Form.Select> 
                        </Form.Group> 
                        <Form.Group className="mb-3"> 
                            <Form.Label>Ghi chú</Form.Label> 
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="note" 
                                value={formData.note} 
                                onChange={handleChange} 
                            /> 
                        </Form.Group> 
                    </Form> 
                )} 
            </Modal.Body> 
            <Modal.Footer> 
                <Button variant="secondary" onClick={handleClose}> 
                    Hủy 
                </Button> 
                <Button  
                    variant="primary"  
                    onClick={handleSubmit}  
                    disabled={modalLoading || !formData.tripId || !formData.busId || !formData.driverId || !formData.routeId} 
                > 
                    Thêm lịch trình 
                </Button> 
            </Modal.Footer> 
        </Modal> 
    ); 
 }; 


 const ScheduleManagement = () => { 
    const [events, setEvents] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [currentDate, setCurrentDate] = useState(new Date()); 

    const [showConfirmModal, setShowConfirmModal] = useState(false); 
    const [scheduleToDeleteId, setScheduleToDeleteId] = useState(null); 

    const [showAlertDialog, setShowAlertDialog] = useState(false); 
    const [alertMessage, setAlertMessage] = useState(""); 

    const [showEventModal, setShowEventModal] = useState(false); 
    const [selectedEvent, setSelectedEvent] = useState(null); 

    const [showAddScheduleModal, setShowAddScheduleModal] = useState(false); 
    const [selectedSlotForAdd, setSelectedSlotForAdd] = useState(null); 

    const fetchSchedules = async () => { 
        setLoading(true); 
        try { 
            let res = await authApis().get(endpoints.schedules); 
            console.log("✅ Dữ liệu lịch trình gốc từ API:", res.data); 

            if (Array.isArray(res.data)) { 
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
            } else { 
                console.error("❌ Dữ liệu API không phải là mảng:", res.data); 
                setEvents([]); 
                setError("Dữ liệu trả về không hợp lệ từ API. Vui lòng kiểm tra lại cấu trúc dữ liệu."); 
            } 
        } catch (err) { 
            console.error("❌ Lỗi khi tải lịch trình:", err); 
            setError("Không thể tải danh sách lịch trình. Vui lòng kiểm tra kết nối và trạng thái đăng nhập."); 
        } finally { 
            setLoading(false); 
        } 
    }; 

    useEffect(() => { 
        fetchSchedules(); 
    }, []); 

    const handleSelectEvent = (event) => { 
        setSelectedEvent(event); 
        setShowEventModal(true); 
    }; 

    const handleDeleteEventFromModal = (scheduleId) => { 
        setShowEventModal(false); 
        setScheduleToDeleteId(scheduleId); 
        setShowConfirmModal(true); 
    }; 

    const confirmDelete = async () => { 
        setShowConfirmModal(false); 
        if (!scheduleToDeleteId) return; 

        try { 
            await authApis().delete(endpoints.scheduleDetail(scheduleToDeleteId)); 
            setAlertMessage("✅ Đã xóa lịch trình thành công!"); 
            setShowAlertDialog(true); 
            fetchSchedules(); 
        } catch (err) { 
            console.error("❌ Lỗi khi xóa lịch trình:", err); 
            setAlertMessage("❌ Không thể xóa lịch trình! Vui lòng thử lại sau."); 
            setShowAlertDialog(true); 
        } finally { 
            setScheduleToDeleteId(null); 
        } 
    }; 

    const handleSelectSlot = ({ start, end }) => { 
        setSelectedSlotForAdd({ start, end }); 
        setShowAddScheduleModal(true); 
    }; 

    return ( 
        <> 
            <h1 className="text-center my-4">Quản lý lịch trình xe khách </h1> 

            {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>} 

            {loading ? ( 
                <div className="text-center my-5"> 
                    <Spinner animation="border" variant="primary" role="status"> 
                        <span className="visually-hidden">Đang tải...</span> 
                    </Spinner> 
                    <p className="text-muted mt-3">Đang tải dữ liệu lịch trình...</p> 
                </div> 
            ) : ( 
                <StyledCalendarContainer> 
                    <Calendar 
                        localizer={localizer} 
                        events={events} 
                        startAccessor="start" 
                        endAccessor="end" 
                        defaultView="week" 
                        views={["week", "day", "month"]} 
                        selectable 
                        resizable 
                        date={currentDate} 
                        onNavigate={setCurrentDate} 
                        min={new Date(new Date().setHours(0, 0, 0, 0))} // Bắt đầu từ 00:00 
                        max={new Date(new Date().setHours(23, 59, 59, 999))} // Kết thúc tại 23:59:59 
                        step={60} 
                        timeslots={1} 
                        onSelectSlot={handleSelectSlot} 
                        onSelectEvent={handleSelectEvent} 
                        formats={{ timeGutterFormat: 'HH:mm' }} 
                    /> 
                </StyledCalendarContainer> 
            )} 

            {/* Modal: Chi tiết lịch trình */} 
            <EventDetailModal 
                show={showEventModal} 
                handleClose={() => setShowEventModal(false)} 
                event={selectedEvent} 
                onDelete={handleDeleteEventFromModal} 
            /> 

            {/* Modal: Xác nhận xóa */} 
            <ConfirmationModal 
                show={showConfirmModal} 
                handleClose={() => setShowConfirmModal(false)} 
                handleConfirm={confirmDelete} 
                message="Bạn có chắc chắn muốn xóa lịch trình này?" 
            /> 

            {/* Modal: Thông báo */} 
            <AlertDialog 
                show={showAlertDialog} 
                handleClose={() => setShowAlertDialog(false)} 
                message={alertMessage} 
            /> 

            {/* Modal Thêm lịch trình */} 
            <AddScheduleModal 
                show={showAddScheduleModal} 
                handleClose={() => setShowAddScheduleModal(false)} 
                initialStart={selectedSlotForAdd?.start} 
                initialEnd={selectedSlotForAdd?.end} 
                onScheduleAdded={fetchSchedules} 
            /> 
        </> 
    ); 
 }; 

 export default ScheduleManagement;
