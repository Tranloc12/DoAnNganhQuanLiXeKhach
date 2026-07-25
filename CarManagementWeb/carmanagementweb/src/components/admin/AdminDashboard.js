import React, { useState, useEffect } from 'react';
import { authApis, endpoints } from '../../configs/Apis';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const KpiCard = ({ title, value, icon, change, color, prefix }) => (
    <div className={`kpi-card kpi-${color}`}>
        <div className="kpi-icon">{icon}</div>
        <div className="kpi-content">
            <p className="kpi-title">{title}</p>
            <h2 className="kpi-value">{prefix}{typeof value === 'number' ? value.toLocaleString('vi-VN') : value}</h2>
            {change && <span className={`kpi-change ${change > 0 ? 'positive' : 'negative'}`}>
                {change > 0 ? '▲' : '▼'} {Math.abs(change)}% so với tháng trước
            </span>}
        </div>
    </div>
);

export default function AdminDashboard() {
    const [overview, setOverview] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [topTrips, setTopTrips] = useState([]);
    const [occupancy, setOccupancy] = useState([]);
    const [bookingStatus, setBookingStatus] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchAll();
    }, [selectedYear]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const api = authApis();
            const [ovRes, monthRes, dayRes, tripRes, occRes, statusRes, hourRes] = await Promise.all([
                api.get('/dashboard/overview'),
                api.get(`/dashboard/revenue/monthly?year=${selectedYear}`),
                api.get('/dashboard/revenue/daily'),
                api.get('/dashboard/top-trips?limit=5'),
                api.get('/dashboard/occupancy'),
                api.get('/dashboard/bookings/status'),
                api.get('/dashboard/bookings/hourly'),
            ]);
            setOverview(ovRes.data);
            setMonthlyRevenue(monthRes.data);
            setDailyRevenue(dayRes.data);
            setTopTrips(tripRes.data);
            setOccupancy(occRes.data.slice(0, 8));
            setBookingStatus(statusRes.data);
            setHourlyData(hourRes.data);
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatVND = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    const formatTooltip = (value) => formatVND(value);

    if (loading) return (
        <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
        </div>
    );

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">📊 Bảng Điều Khiển Quản Trị</h1>
                    <p className="dashboard-subtitle">White Luxury Bus Management System</p>
                </div>
                <div className="dashboard-controls">
                    <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)} className="year-select">
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={fetchAll} className="refresh-btn">🔄 Làm mới</button>
                </div>
            </div>

            {/* KPI Cards */}
            {overview && (
                <div className="kpi-grid">
                    <KpiCard title="Tổng Doanh Thu" value={overview.totalRevenue} icon="💰" color="purple" prefix="₫" />
                    <KpiCard title="Doanh Thu Tháng Này" value={overview.monthRevenue} icon="📈" color="blue" prefix="₫" />
                    <KpiCard title="Tổng Đặt Vé" value={overview.totalBookings} icon="🎫" color="green" />
                    <KpiCard title="Đặt Vé Hôm Nay" value={overview.todayBookings} icon="🔥" color="orange" />
                    <KpiCard title="Tổng Hành Khách" value={overview.totalPassengers} icon="👥" color="pink" />
                    <KpiCard title="Tổng Chuyến Xe" value={overview.totalTrips} icon="🚌" color="teal" />
                </div>
            )}

            {/* Tabs */}
            <div className="dashboard-tabs">
                {['overview', 'revenue', 'trips', 'analysis'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
                        {tab === 'overview' && '📊 Tổng Quan'}
                        {tab === 'revenue' && '💰 Doanh Thu'}
                        {tab === 'trips' && '🚌 Chuyến Xe'}
                        {tab === 'analysis' && '🔍 Phân Tích'}
                    </button>
                ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
                <div className="charts-grid">
                    {/* Monthly Revenue Line Chart */}
                    <div className="chart-card chart-wide">
                        <h3 className="chart-title">📈 Doanh Thu Theo Tháng ({selectedYear})</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyRevenue}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                                <XAxis dataKey="month" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                                <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fill: '#a0aec0', fontSize: 12 }} />
                                <Tooltip formatter={formatTooltip} contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenueGrad)" strokeWidth={2} name="Doanh thu" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Booking Status Pie */}
                    <div className="chart-card">
                        <h3 className="chart-title">🎫 Trạng Thái Đặt Vé</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={bookingStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                                    dataKey="count" nameKey="status" label={({ status, percent }) => `${status}: ${(percent*100).toFixed(0)}%`}
                                    labelLine={false}>
                                    {bookingStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Trips Bar Chart */}
                    <div className="chart-card chart-wide">
                        <h3 className="chart-title">🏆 Top 5 Tuyến Doanh Thu Cao Nhất</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={topTrips} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                                <XAxis type="number" tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fill: '#a0aec0', fontSize: 12 }} />
                                <YAxis type="category" dataKey="routeName" width={150} tick={{ fill: '#a0aec0', fontSize: 11 }} />
                                <Tooltip formatter={formatTooltip} contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="totalRevenue" name="Doanh thu" radius={[0, 6, 6, 0]}>
                                    {topTrips.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Tab: Revenue */}
            {activeTab === 'revenue' && (
                <div className="charts-grid">
                    <div className="chart-card chart-full">
                        <h3 className="chart-title">📅 Doanh Thu 30 Ngày Gần Nhất</h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={dailyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                                <XAxis dataKey="date" tick={{ fill: '#a0aec0', fontSize: 11 }} />
                                <YAxis tickFormatter={v => `${(v/1000000).toFixed(1)}M`} tick={{ fill: '#a0aec0' }} />
                                <Tooltip formatter={formatTooltip} contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name="Doanh thu" />
                                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} name="Số vé" yAxisId="right" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Tab: Trips */}
            {activeTab === 'trips' && (
                <div className="charts-grid">
                    <div className="chart-card chart-full">
                        <h3 className="chart-title">📊 Tỷ Lệ Lấp Đầy Theo Tuyến (%)</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={occupancy} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: '#a0aec0' }} />
                                <YAxis type="category" dataKey="routeName" width={180} tick={{ fill: '#a0aec0', fontSize: 11 }} />
                                <Tooltip formatter={v => `${v}%`} contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="occupancyRate" name="Lấp đầy" radius={[0, 6, 6, 0]}>
                                    {occupancy.map((entry, i) => (
                                        <Cell key={i} fill={entry.occupancyRate > 80 ? '#ef4444' : entry.occupancyRate > 50 ? '#f59e0b' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top trips table */}
                    <div className="chart-card chart-full">
                        <h3 className="chart-title">🚌 Bảng Xếp Hạng Chuyến Xe</h3>
                        <div className="trips-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tuyến Đường</th>
                                        <th>Tổng Đặt Vé</th>
                                        <th>Doanh Thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topTrips.map((trip, i) => (
                                        <tr key={trip.tripId}>
                                            <td><span className={`rank rank-${i+1}`}>{i+1}</span></td>
                                            <td>{trip.routeName}</td>
                                            <td>{trip.totalBookings.toLocaleString()} vé</td>
                                            <td className="revenue-cell">{formatVND(trip.totalRevenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Analysis */}
            {activeTab === 'analysis' && (
                <div className="charts-grid">
                    <div className="chart-card chart-full">
                        <h3 className="chart-title">⏰ Lượng Đặt Vé Theo Giờ Trong Ngày</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                                <XAxis dataKey="hour" tick={{ fill: '#a0aec0', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#a0aec0' }} />
                                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="bookings" name="Số đặt vé" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="chart-note">💡 Insight: Xác định khung giờ cao điểm để chạy marketing và tăng server capacity</p>
                    </div>
                </div>
            )}
        </div>
    );
}
