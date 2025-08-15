// src/components/bus/EditBusForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditBusForm = () => {
  const { id } = useParams(); // lấy id từ URL: /buses/:id/edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    licensePlate: '',
    model: '',
    capacity: 0,
    yearManufacture: new Date().getFullYear(),
    status: '',
    description: '',
    isActive: false,
  });

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/CarManagementApp/api/buses/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error('❌ Lỗi khi tải thông tin xe buýt:', error);
        alert('Không thể tải thông tin xe buýt');
      }
    };

    fetchBus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/CarManagementApp/api/buses/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      alert('✅ Cập nhật xe buýt thành công!');
      navigate('/bus-management'); // chuyển hướng sau khi cập nhật
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật xe buýt:', error);
      alert('Không thể cập nhật xe buýt');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Chỉnh sửa Xe Buýt</h2>

      <div>
        <label>Biển số xe:</label>
        <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} required />
      </div>

      <div>
        <label>Kiểu xe:</label>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required />
      </div>

      <div>
        <label>Sức chứa:</label>
        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
      </div>

      <div>
        <label>Năm sản xuất:</label>
        <input type="number" name="yearManufacture" value={formData.yearManufacture} onChange={handleChange} required />
      </div>

      <div>
        <label>Trạng thái:</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">-- Chọn trạng thái --</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label>Mô tả:</label>
        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
      </div>

      <div>
        <label>Hoạt động:</label>
        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
      </div>

      <button type="submit">Cập nhật xe buýt</button>
    </form>
  );
};

export default EditBusForm;
