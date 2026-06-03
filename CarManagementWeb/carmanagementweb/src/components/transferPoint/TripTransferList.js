import React, { useEffect, useState } from "react";
import {
    getAllTripTransfers,
    addTripTransfer,
    updateTripTransfer, // ✅ Thêm hàm update
    deleteTripTransfer,
} from "./tripTransferApi";
import { getAllTransferPoints } from "./transferPointApi";
import { getAllTrip } from "./tripApi";

export default function TripTransferList() {
    const [tripTransfers, setTripTransfers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [transferPoints, setTransferPoints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null); // ✅ Thêm state để quản lý id đang chỉnh sửa
    const [newTripTransfer, setNewTripTransfer] = useState({
        tripId: "",
        transferPointId: "",
        stopOrder: 1,
        note: "",
        arrivalTime: "",
        departureTime: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ttData, tripData, tpData] = await Promise.all([
                    getAllTripTransfers(),
                    getAllTrip(),
                    getAllTransferPoints(),
                ]);
                setTripTransfers(Array.isArray(ttData) ? ttData : []);
                setTrips(Array.isArray(tripData) ? tripData : []);
                setTransferPoints(Array.isArray(tpData) ? tpData : []);
            } catch (err) {
                console.error("Lỗi khi load dữ liệu:", err);
            }
        };
        fetchData();
    }, []);

    const handleSave = async (e) => { // ✅ Đổi tên hàm thành handleSave
        e.preventDefault();
        try {
            const tripTransferToSave = {
                ...newTripTransfer,
                // ✅ Chuyển đổi chuỗi datetime-local sang timestamp khi gửi đi
                arrivalTime: newTripTransfer.arrivalTime ? new Date(newTripTransfer.arrivalTime).getTime() : null,
                departureTime: newTripTransfer.departureTime ? new Date(newTripTransfer.departureTime).getTime() : null,
            };

            if (editingId) {
                // ✅ Logic cập nhật
                const updated = await updateTripTransfer(editingId, tripTransferToSave);
                setTripTransfers(prev => prev.map(t => t.id === editingId ? updated : t));
                setEditingId(null);
            } else {
                // ✅ Logic thêm mới
                const added = await addTripTransfer(tripTransferToSave);
                setTripTransfers(prev => [...prev, added]);
            }
            setShowForm(false);
            resetForm();
        } catch (err) {
            console.error("Lỗi khi lưu TripTransfer:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa TripTransfer này?")) {
            try {
                await deleteTripTransfer(id);
                setTripTransfers((prev) => prev.filter((t) => t.id !== id));
            } catch (err) {
                console.error("Lỗi khi xóa TripTransfer:", err);
            }
        }
    };

    const handleEdit = (tripTransfer) => { // ✅ Hàm xử lý chỉnh sửa
        setEditingId(tripTransfer.id);
        setShowForm(true);
        // ✅ Khởi tạo form với dữ liệu hiện tại, chuyển timestamp về chuỗi
        setNewTripTransfer({
            tripId: tripTransfer.tripId?.id,
            transferPointId: tripTransfer.transferPointId?.id,
            stopOrder: tripTransfer.stopOrder,
            note: tripTransfer.note,
            arrivalTime: toInputDateTimeString(tripTransfer.arrivalTime),
            departureTime: toInputDateTimeString(tripTransfer.departureTime),
        });
    };

    const resetForm = () => {
        setNewTripTransfer({
            tripId: "",
            transferPointId: "",
            stopOrder: 1,
            note: "",
            arrivalTime: "",
            departureTime: "",
        });
        setEditingId(null);
    };

    // Hàm để định dạng thời gian từ mảng [năm, tháng, ngày, giờ, phút]
    const formatArrayDate = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length < 5) return "Không rõ";
        const [year, month, day, hour, minute] = arr;
        const d = new Date(year, month - 1, day, hour, minute);
        return d.toLocaleString("vi-VN");
    };

    // Hàm để định dạng thời gian từ timestamp (millisecond)
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Không rõ";
        const d = new Date(timestamp);
        return d.toLocaleString("vi-VN");
    };

    // Hàm để chuyển đổi timestamp sang chuỗi cho input datetime-local
    const toInputDateTimeString = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    return (
        <div className="container mt-4">
            <h2>🚐 Danh sách TripTransfers</h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setShowForm(!showForm);
                    resetForm();
                }}
            >
                ➕ Thêm TripTransfer
            </button>
            {showForm && (
                <form onSubmit={handleSave} className="border p-3 mb-3 bg-light rounded">
                    {/* Các input form */}
                    <select
                        className="form-control mb-2"
                        value={newTripTransfer.tripId}
                        onChange={(e) =>
                            setNewTripTransfer({ ...newTripTransfer, tripId: e.target.value })
                        }
                        required
                    >
                        <option value="">-- Chọn Trip --</option>
                        {trips.map((trip) => (
                            <option key={trip.id} value={trip.id}>
                                #{trip.id} - {trip.routeId?.routeName} ({trip.busId?.licensePlate})
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-control mb-2"
                        value={newTripTransfer.transferPointId}
                        onChange={(e) =>
                            setNewTripTransfer({
                                ...newTripTransfer,
                                transferPointId: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">-- Chọn Transfer Point --</option>
                        {transferPoints.map((tp) => (
                            <option key={tp.id} value={tp.id}>
                                {tp.name} - {tp.address}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Order"
                        value={newTripTransfer.stopOrder}
                        onChange={(e) =>
                            setNewTripTransfer({
                                ...newTripTransfer,
                                stopOrder: parseInt(e.target.value),
                            })
                        }
                        required
                    />

                    <label>Thời gian đến:</label>
                    <input
                        type="datetime-local"
                        className="form-control mb-2"
                        value={newTripTransfer.arrivalTime}
                        onChange={(e) =>
                            setNewTripTransfer({
                                ...newTripTransfer,
                                arrivalTime: e.target.value,
                            })
                        }
                    />

                    <label>Thời gian đi:</label>
                    <input
                        type="datetime-local"
                        className="form-control mb-2"
                        value={newTripTransfer.departureTime}
                        onChange={(e) =>
                            setNewTripTransfer({
                                ...newTripTransfer,
                                departureTime: e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Note"
                        value={newTripTransfer.note}
                        onChange={(e) =>
                            setNewTripTransfer({ ...newTripTransfer, note: e.target.value })
                        }
                    />

                    <button type="submit" className="btn btn-success">
                        {editingId ? "Cập nhật" : "Lưu"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                            setShowForm(false);
                            resetForm();
                        }}
                    >
                        Hủy
                    </button>
                </form>
            )}

            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Trip</th>
                        <th>Transfer Point</th>
                        <th>Thời gian</th>
                        <th>Order</th>
                        <th>Ghi chú</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {tripTransfers.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>
                                <strong>#{t.tripId?.id}</strong> - {t.tripId?.routeId?.routeName}
                                <br />
                                🚌 {t.tripId?.busId?.licensePlate}
                                <br />
                                ⏰ **Khởi hành:** {formatArrayDate(t.tripId?.departureTime)}
                            </td>
                            <td>
                                {t.transferPointId?.name}
                                <br />
                                <small>{t.transferPointId?.address}</small>
                            </td>
                            <td>
                                <strong>Đến:</strong> {formatTimestamp(t.arrivalTime)}
                                <br />
                                <strong>Đi:</strong> {formatTimestamp(t.departureTime)}
                            </td>
                            <td>{t.stopOrder}</td>
                            <td>{t.note}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(t)}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    {tripTransfers.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có TripTransfer nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}