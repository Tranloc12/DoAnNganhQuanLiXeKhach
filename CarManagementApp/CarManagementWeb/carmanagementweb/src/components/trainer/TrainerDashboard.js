import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis.js";
import { Container, Button, Spinner, Alert, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/apiUtils";


import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend as PieLegend
} from "recharts";

import {
    RadialBarChart,
    RadialBar,
    Legend as RadialLegend,
    PolarAngleAxis
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ff7300'];

const TrainerDashboard = () => {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [errorMembers, setErrorMembers] = useState(null);

    const [progressList, setProgressList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Chọn kiểu biểu đồ: "line" hoặc "pie"
    const [chartType, setChartType] = useState("line");
    // Lấy danh sách hội viên
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await authApis().get(endpoints['members']);
                console.log("API trả về:", res.data);
                setMembers(res.data);
                setErrorMembers(null);
            } catch (err) {
                console.error(err);
                setErrorMembers("Không tải được danh sách hội viên");
            } finally {
                setLoadingMembers(false);
            }
        };
        fetchMembers();
    }, []);

    // Lấy tiến độ của hội viên đã chọn
    useEffect(() => {
        if (!selectedMemberId) return;

        const fetchProgress = async () => {
            setLoading(true);
            setError(null);
            try {
                const formData = new FormData();
                formData.append('memberId', selectedMemberId);

                const res = await authApis().post(endpoints['trainer-progress'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("recordDate thô từ API:", res.data.map(item => item.recordDate));

                if (!Array.isArray(res.data)) {
                    setError(res.data || "Lỗi khi tải tiến độ");
                    setProgressList([]);
                    return;
                }

                const formatted = res.data.map((item) => {
                    return {
                        ...item,
                        recordDate: formatDate(item.recordDate),
                    };
                });

                setProgressList(formatted);
            } catch (err) {
                console.error(err);
                setError("Không thể tải dữ liệu tiến độ!");
                setProgressList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [selectedMemberId]);

    // Chuẩn bị dữ liệu cho PieChart: lấy bản ghi mới nhất
    const latestRecord = progressList.length > 0 ? progressList[progressList.length - 1] : null;

    const pieData = latestRecord ? [
        { name: 'Cân nặng (kg)', value: latestRecord.weight },
        { name: 'Tỷ lệ mỡ (%)', value: latestRecord.bodyFat },
        { name: 'Khối cơ (kg)', value: latestRecord.muscle },
    ] : [];
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Quản lý Tiến độ Hội viên</h2>

            {/* Hiển thị danh sách hội viên */}
            {loadingMembers ? (
                <Spinner animation="border" variant="primary" />
            ) : errorMembers ? (
                <Alert variant="danger">{errorMembers}</Alert>
            ) : (
                <Form.Select
                    className="mb-3"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                >
                    <option value="">-- Chọn hội viên --</option>
                    {members.map((m) => (
                        <option key={m.id} value={m.id}>
                            Hội viên {m.id} - Mục tiêu: {m.goal}
                        </option>
                    ))}
                </Form.Select>
            )}

            {/* Nút tạo tiến độ */}
            <Button
                variant="success"
                className="mb-3"
                onClick={() => navigate(`/progress-create?memberId=${selectedMemberId}`)}
                disabled={!selectedMemberId}
            >
                Tạo tiến độ mới
            </Button>

            {/* Tiến độ */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : progressList.length === 0 ? (
                <Alert variant="info">Chưa có tiến độ tập luyện nào.</Alert>
            ) : (
                <>
                    {/* Bảng dữ liệu */}
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày ghi nhận</th>
                                <th>Cân nặng (kg)</th>
                                <th>Tỷ lệ mỡ (%)</th>
                                <th>Khối cơ (kg)</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progressList.map((record, idx) => (
                                <tr key={record.id}>
                                    <td>{idx + 1}</td>
                                    <td>{record.recordDate}</td>
                                    <td>{record.weight}</td>
                                    <td>{record.bodyFat}</td>
                                    <td>{record.muscle}</td>
                                    <td>{record.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Chọn kiểu biểu đồ */}
                    <Form.Select
                        className="mb-3"
                        value={chartType}
                        onChange={e => setChartType(e.target.value)}
                        disabled={progressList.length === 0}
                    >
                        <option value="line">Biểu đồ đường</option>
                        <option value="pie">Biểu đồ hình tròn</option>
                        <option value="radial">Biểu đồ thanh tròn (Radial)</option>
                    </Form.Select>

                    {/* Biểu đồ */}
                    <div style={{ minHeight: 400 }}>
                        <h4 className="mb-3">Biểu đồ tiến độ hội viên</h4>

                        {chartType === "line" && (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={progressList}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="recordDate" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" stroke={COLORS[0]} name="Cân nặng (kg)" />
                                    <Line type="monotone" dataKey="bodyFat" stroke={COLORS[1]} name="Tỷ lệ mỡ (%)" />
                                    <Line type="monotone" dataKey="muscle" stroke={COLORS[2]} name="Khối cơ (kg)" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}

                        {chartType === "pie" && latestRecord && (
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <PieLegend verticalAlign="bottom" height={36} />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}

                        {chartType === "radial" && latestRecord && (
                            <div className="d-flex justify-content-around flex-wrap">
                                {["weight", "bodyFat", "muscle"].map((key, idx) => {
                                    const labelMap = {
                                        weight: "Cân nặng (kg)",
                                        bodyFat: "Tỷ lệ mỡ (%)",
                                        muscle: "Khối cơ (kg)"
                                    };

                                    const value = latestRecord[key];
                                    const data = [{ name: labelMap[key], value, fill: COLORS[idx] }];

                                    return (
                                        <div key={key} style={{ width: 250, height: 250, marginBottom: 20 }}>
                                            <h6 className="text-center">{labelMap[key]}</h6>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadialBarChart
                                                    innerRadius="60%"
                                                    outerRadius="100%"
                                                    data={data}
                                                    startAngle={90}
                                                    endAngle={450}
                                                >
                                                    <PolarAngleAxis
                                                        type="number"
                                                        domain={[0, Math.max(value * 1.5, 10)]}
                                                        angleAxisId={0}
                                                        tick={false}
                                                    />
                                                    <RadialBar
                                                        minAngle={15}
                                                        clockWise
                                                        dataKey="value"
                                                        cornerRadius={10}
                                                    />
                                                    <Tooltip />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {((chartType === "pie" || chartType === "radial") && !latestRecord) && (
                            <Alert variant="info">Không có dữ liệu cho biểu đồ</Alert>
                        )}
                    </div>
                </>
            )}
        </Container >
    );
};

export default TrainerDashboard;
