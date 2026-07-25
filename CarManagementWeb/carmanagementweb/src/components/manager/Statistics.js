import React, { useEffect, useState } from 'react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { authApis, endpoints } from '../../configs/Apis.js';

const Statistic = () => {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [gymUsage, setGymUsage] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const [resMembers, resRevenue, resGymUsage] = await Promise.all([
          authApis().get(endpoints['statistics-members']),
          authApis().get(endpoints['statistics-revenue']),
          authApis().get(endpoints['statistics-gym-usage']),
        ]);

        setTotalMembers(typeof resMembers.data === 'number' ? resMembers.data : 0);
        setTotalRevenue(typeof resRevenue.data === 'number' ? resRevenue.data : 0);

        const usageData = resGymUsage.data;
        const formattedUsage = usageData && typeof usageData === 'object'
          ? Object.entries(usageData).map(([timeSlot, count]) => ({
              timeSlot,
              count: typeof count === 'number' ? count : 0
            }))
          : [];

        setGymUsage(formattedUsage);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải thống kê:', err.response?.data || err.message);
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      }
    };

    loadStatistics();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📊 Thống kê phòng tập</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '30px'
      }}>
        <div style={{
          flex: 1,
          minWidth: '250px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#555' }}>👥 Số lượng hội viên</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalMembers}</p>
        </div>

        <div style={{
          flex: 1,
          minWidth: '250px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#555' }}>💰 Tổng doanh thu</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalRevenue.toLocaleString()} VND</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333' }}>📅 Mức độ sử dụng phòng tập theo khung giờ</h3>
        {gymUsage.length === 0 ? (
          <p>Chưa có dữ liệu lượt sử dụng phòng.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '15px',
            fontSize: '16px'
          }}>
            <thead style={{ backgroundColor: '#eee' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Khung giờ</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Số buổi tập</th>
              </tr>
            </thead>
            <tbody>
              {gymUsage.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.timeSlot}</td>
                  <td style={{ padding: '10px' }}>{item.count} buổi</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ color: '#333' }}>📈 Biểu đồ sử dụng phòng tập</h3>
        {gymUsage.length > 0 && (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={gymUsage}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeSlot" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#4f46e5"
                  name="Số lượt"
                  radius={[4, 4, 0, 0]}
                  label={{ position: 'top', fill: '#555', fontSize: 14 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistic;
