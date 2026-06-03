import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { authApis, endpoints } from '../../configs/Apis.js';

const Statistic = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const COLORS = ['#e8832a', '#22c55e', '#3b82f6', '#d97706', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const [resRevenue, resTrips, resUsers] = await Promise.all([
          authApis().get(endpoints.statisticsRevenue),
          authApis().get(endpoints.statisticsTrips),
          authApis().get(endpoints.statisticsUsers)
        ]);

        // Process Revenue Data: [month, revenue]
        let totalRev = 0;
        const formattedRevenue = resRevenue.data.map(item => {
          totalRev += item[1];
          return { month: `Tháng ${item[0]}`, revenue: item[1] };
        });
        setTotalRevenue(totalRev);
        setRevenueData(formattedRevenue);

        // Process Trip Data: [routeName, count]
        let totalTrp = 0;
        const formattedTrips = resTrips.data.map(item => {
          totalTrp += item[1];
          return { routeName: item[0], count: item[1] };
        });
        setTotalTrips(totalTrp);
        setTripData(formattedTrips);

        // Process User Data: [role, count]
        let totalUsr = 0;
        const formattedUsers = resUsers.data.map(item => {
          totalUsr += item[1];
          let roleName = item[0];
          if(roleName === 'ROLE_ADMIN') roleName = 'Admin';
          if(roleName === 'ROLE_MANAGER') roleName = 'Quản lý';
          if(roleName === 'ROLE_STAFF') roleName = 'Nhân viên';
          if(roleName === 'ROLE_DRIVER') roleName = 'Tài xế';
          if(roleName === 'ROLE_PASSENGER') roleName = 'Hành khách';
          return { role: roleName, count: item[1] };
        });
        setTotalUsers(totalUsr);
        setUserData(formattedUsers);

        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải thống kê:', err);
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      }
    };

    loadStatistics();
  }, []);

  // Hàm xuất CSV
  const exportToCSV = () => {
    // 1. Tạo CSV Doanh Thu
    let csvContent = "Tháng,Doanh Thu (VNĐ)\n";
    revenueData.forEach(row => {
      csvContent += `${row.month},${row.revenue}\n`;
    });
    
    // Thêm khoảng trắng
    csvContent += "\n\n";

    // 2. Tạo CSV Chuyến xe
    csvContent += "Tuyến Đường,Số Chuyến\n";
    tripData.forEach(row => {
      csvContent += `${row.routeName},${row.count}\n`;
    });

    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BaoCao_ThongKe_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '30px', fontFamily: "'Inter', sans-serif", backgroundColor: '#faf9f7', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #e8832a, #f09a40)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(232,131,42,0.3)', marginRight: '16px' }}>
            <i className="fa-solid fa-chart-pie" style={{ color: '#fff', fontSize: '20px' }}></i>
          </div>
          <div>
            <h2 style={{ color: '#1a1410', margin: 0, fontWeight: 800 }}>Dashboard Thống Kê</h2>
            <p style={{ color: '#9c8c78', margin: 0, fontSize: '0.9rem' }}>Tổng quan hoạt động kinh doanh bến xe</p>
          </div>
        </div>
        
        <button onClick={exportToCSV} style={{
          background: '#fff', border: '1.5px solid #16a34a', color: '#16a34a',
          padding: '10px 20px', borderRadius: '10px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(22,163,74,0.1)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#16a34a'; }}>
          <i className="fa-solid fa-file-csv"></i> Xuất Báo Cáo CSV
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-circle-exclamation"></i>{error}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {/* Doanh thu */}
        <div style={{ flex: 1, minWidth: '280px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '100px', color: '#f0fdf4', zIndex: 0 }}><i className="fa-solid fa-money-bill-wave"></i></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 style={{ color: '#9c8c78', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>Tổng Doanh Thu Năm Nay</h4>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Chuyến xe */}
        <div style={{ flex: 1, minWidth: '280px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '100px', color: '#eff6ff', zIndex: 0 }}><i className="fa-solid fa-bus"></i></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 style={{ color: '#9c8c78', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>Tổng Chuyến Đã Chạy</h4>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', margin: 0 }}>{totalTrips} <span style={{ fontSize:'1rem', color:'#9c8c78' }}>chuyến</span></p>
          </div>
        </div>

        {/* User */}
        <div style={{ flex: 1, minWidth: '280px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '100px', color: '#fff8ee', zIndex: 0 }}><i className="fa-solid fa-users"></i></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 style={{ color: '#9c8c78', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>Tổng Thành Viên</h4>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#e8832a', margin: 0 }}>{totalUsers} <span style={{ fontSize:'1rem', color:'#9c8c78' }}>người dùng</span></p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* Doanh thu theo tháng */}
        <div style={{ flex: 2, minWidth: '500px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h3 style={{ color: '#1a1410', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>📈 Doanh thu theo tháng</h3>
          {revenueData.length > 0 ? (
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#9c8c78'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#9c8c78'}} tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} labelStyle={{color:'#1a1410', fontWeight:700}} contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu (VNĐ)" stroke="#16a34a" strokeWidth={4} dot={{ r: 6, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p style={{ color: '#9c8c78' }}>Chưa có dữ liệu doanh thu</p>}
        </div>

        {/* Tỉ lệ user */}
        <div style={{ flex: 1, minWidth: '300px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h3 style={{ color: '#1a1410', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>👥 Cơ cấu người dùng</h3>
          {userData.length > 0 ? (
            <div style={{ width: '100%', height: 350, display:'flex', flexDirection:'column', alignItems:'center' }}>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={userData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="role">
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'12px', marginTop:'10px' }}>
                {userData.map((entry, index) => (
                  <div key={index} style={{ display:'flex', alignItems:'center', fontSize:'0.85rem', color:'#5c4f3a' }}>
                    <span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', background:COLORS[index % COLORS.length], marginRight:'6px' }}></span>
                    {entry.role} ({entry.count})
                  </div>
                ))}
              </div>
            </div>
          ) : <p style={{ color: '#9c8c78' }}>Chưa có dữ liệu người dùng</p>}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h3 style={{ color: '#1a1410', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>🚌 Số chuyến xe theo tuyến đường</h3>
        {tripData.length > 0 ? (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={tripData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="routeName" axisLine={false} tickLine={false} tick={{fill:'#9c8c78', fontSize:'0.8rem'}} angle={-15} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#9c8c78'}} />
                <Tooltip cursor={{fill: 'rgba(232,131,42,0.05)'}} contentStyle={{borderRadius:'10px', border:'none', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="count" name="Số lượng chuyến" fill="#e8832a" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <p style={{ color: '#9c8c78' }}>Chưa có dữ liệu chuyến xe</p>}
      </div>

    </div>
  );
};

export default Statistic;
