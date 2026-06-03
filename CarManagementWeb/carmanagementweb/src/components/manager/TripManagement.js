import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Table, Button, Card, Form, Input, Select, Tag, Space, message, Popconfirm, Tooltip, Row, Col } from "antd";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { Link } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

const { Option } = Select;

// Styled Components for White Luxury aesthetic
const ImpeccableContainer = styled.div`
  padding: 24px;
  background-color: #faf9f7;
  min-height: 100vh;
`;

const HeaderTitle = styled.h2`
  font-weight: 600;
  color: #1a1410;
  margin-bottom: 0;
  font-family: 'Inter', sans-serif;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #e8e6e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
  }
`;

const LuxuryTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #ffffff;
    color: #1a1410;
    font-weight: 600;
    border-bottom: 2px solid #f0f0f0;
  }
  .ant-table-tbody > tr:hover > td {
    background-color: #fdfaf7 !important;
  }
`;

const TripManagement = () => {
    const [trips, setTrips] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [form] = Form.useForm();

    const fetchTrips = async (params = {}) => {
        setLoading(true);
        try {
            const query = new URLSearchParams(params).toString();
            const res = await authApis().get(`${endpoints.trips}?${query}`);
            setTrips(res.data.map(item => ({ ...item, key: item.id })));
        } catch (err) {
            message.error("Không thể tải danh sách chuyến đi.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterData = async () => {
        try {
            const [routesRes, busesRes, driversRes] = await Promise.all([
                authApis().get(endpoints.routes),
                authApis().get(endpoints.buses),
                authApis().get(endpoints.drivers)
            ]);
            setRoutes(routesRes.data);
            setBuses(busesRes.data);
            setDrivers(driversRes.data);
        } catch (err) {
            message.error("Lỗi khi tải dữ liệu bộ lọc.");
        }
    };

    useEffect(() => {
        fetchTrips();
        fetchFilterData();
    }, []);

    const onFinish = (values) => {
        const params = { ...values };
        if (values.departureTime) {
            params.departureTime = values.departureTime.format("YYYY-MM-DDTHH:mm");
        }
        if (values.arrivalTime) {
            params.arrivalTime = values.arrivalTime.format("YYYY-MM-DDTHH:mm");
        }
        fetchTrips(params);
    };

    const handleReset = () => {
        form.resetFields();
        fetchTrips();
    };

    const confirmDelete = async (id) => {
        try {
            await authApis().delete(endpoints.deleteTrip(id));
            setTrips(trips.filter((t) => t.id !== id));
            message.success("Xóa chuyến đi thành công!");
        } catch (err) {
            message.error("Xóa chuyến đi thất bại.");
        }
    };

    const formatDateTime = (arr) => {
        if (!arr || arr.length < 5) return "---";
        const [y, m, d, h, min] = arr;
        return moment(`${y}-${m}-${d} ${h}:${min}`).format("DD/MM/YYYY HH:mm");
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 60, fixed: 'left' },
        { title: "Tuyến", dataIndex: "routeName", key: "routeName", width: 150 },
        { title: "Điểm đầu", dataIndex: "origin", key: "origin" },
        { title: "Điểm cuối", dataIndex: "destination", key: "destination" },
        { title: "Xe", dataIndex: "busLicensePlate", key: "busLicensePlate" },
        { title: "Tài xế", dataIndex: "driverName", key: "driverName" },
        { 
            title: "Khởi hành", 
            dataIndex: "departureTime", 
            key: "departureTime",
            render: (val) => formatDateTime(val) 
        },
        { 
            title: "Giá vé", 
            dataIndex: "fare", 
            key: "fare",
            render: (val) => <span style={{ color: '#e8832a', fontWeight: 'bold' }}>{val?.toLocaleString()}đ</span>
        },
        { title: "Ghế trống", dataIndex: "availableSeats", key: "availableSeats", align: 'center' },
        { 
            title: "Trạng thái", 
            dataIndex: "status", 
            key: "status",
            render: (status) => {
                let color = status === 'DONE' ? 'green' : status === 'SCHEDULED' ? 'blue' : 'volcano';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Hành động",
            key: "action",
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/manager/trips/edit/${record.id}`}>
                        <Tooltip title="Chỉnh sửa">
                            <Button type="text" icon={<AiOutlineEdit size={18} style={{ color: '#faad14' }} />} />
                        </Tooltip>
                    </Link>
                    <Popconfirm
                        title="Xóa chuyến đi"
                        description="Bạn có chắc chắn muốn xóa chuyến đi này?"
                        onConfirm={() => confirmDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button type="text" danger icon={<AiOutlineDelete size={18} />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <ImpeccableContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <HeaderTitle>Quản lý chuyến đi</HeaderTitle>
                <Link to="/manager/trips/add">
                    <Button type="primary" icon={<AiOutlinePlus />} style={{ backgroundColor: '#e8832a', borderColor: '#e8832a', borderRadius: 8, height: 40, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                        Thêm chuyến đi
                    </Button>
                </Link>
            </div>

            <StyledCard title="Bộ lọc tìm kiếm">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item name="routeId" label="Tuyến đường">
                                <Select placeholder="Tất cả" allowClear>
                                    {routes.map(r => <Option key={r.id} value={r.id}>{r.routeName}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item name="busId" label="Xe">
                                <Select placeholder="Tất cả" allowClear>
                                    {buses.map(b => <Option key={b.id} value={b.id}>{b.licensePlate}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item name="status" label="Trạng thái">
                                <Select placeholder="Tất cả" allowClear>
                                    <Option value="SCHEDULED">SCHEDULED</Option>
                                    <Option value="DONE">DONE</Option>
                                    <Option value="CANCELLED">CANCELLED</Option>
                                    <Option value="DELAYED">DELAYED</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item name="origin" label="Điểm xuất phát">
                                <Input placeholder="Nhập điểm đầu..." allowClear />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button icon={<AiOutlineReload />} onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Khôi phục</Button>
                            <Button type="primary" htmlType="submit" icon={<AiOutlineSearch />} style={{ backgroundColor: '#1a1410', borderColor: '#1a1410', display: 'flex', alignItems: 'center', gap: 6 }}>Tìm kiếm</Button>
                        </Space>
                    </div>
                </Form>
            </StyledCard>

            <StyledCard bodyStyle={{ padding: 0 }}>
                <LuxuryTable 
                    columns={columns} 
                    dataSource={trips} 
                    loading={loading}
                    pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                    scroll={{ x: 'max-content' }}
                />
            </StyledCard>
        </ImpeccableContainer>
    );
};

export default TripManagement;