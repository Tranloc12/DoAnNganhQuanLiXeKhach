import React, { useEffect, useState } from "react";
import axios from "axios";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    driverId: "",
    busId: "",
    routeId: "",
    tripId: "",
    startTime: "",
    endTime: "",
    shiftType: "",
    status: "",
    note: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://localhost:8080/CarManagementApp/api/driver-schedules";

  // Load danh sách
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(API_URL);
      setSchedules(res.data);
    } catch (err) {
      console.error("Error fetching schedules", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Xử lý input thay đổi
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchSchedules();
      resetForm();
    } catch (err) {
      console.error("Error saving schedule", err);
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchSchedules();
      } catch (err) {
        console.error("Error deleting schedule", err);
      }
    }
  };

  // Sửa
  const handleEdit = (schedule) => {
    setFormData(schedule);
    setIsEditing(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      driverId: "",
      busId: "",
      routeId: "",
      tripId: "",
      startTime: "",
      endTime: "",
      shiftType: "",
      status: "",
      note: "",
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý Lịch Chạy Tài Xế</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input type="hidden" name="id" value={formData.id} />

        <input
          type="number"
          name="driverId"
          placeholder="Driver ID"
          value={formData.driverId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="busId"
          placeholder="Bus ID"
          value={formData.busId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="routeId"
          placeholder="Route ID"
          value={formData.routeId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tripId"
          placeholder="Trip ID"
          value={formData.tripId}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="shiftType"
          placeholder="Shift Type"
          value={formData.shiftType}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="note"
          placeholder="Note"
          value={formData.note}
          onChange={handleChange}
        />

        <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
        {isEditing && <button onClick={resetForm}>Hủy</button>}
      </form>

      {/* Bảng dữ liệu */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Driver</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Trip</th>
            <th>Start</th>
            <th>End</th>
            <th>Shift</th>
            <th>Status</th>
            <th>Note</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.driverId}</td>
              <td>{s.busId}</td>
              <td>{s.routeId}</td>
              <td>{s.tripId}</td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>{s.shiftType}</td>
              <td>{s.status}</td>
              <td>{s.note}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Sửa</button>
                <button onClick={() => handleDelete(s.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
