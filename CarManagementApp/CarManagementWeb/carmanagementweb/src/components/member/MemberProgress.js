import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis.js";
import { Container, Spinner, Alert, Table, Button, Form, Row, Col } from "react-bootstrap";
import { formatDate } from "../../utils/apiUtils";

const MemberProgress = () => {
    const [progressList, setProgressList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [memberInfo, setMemberInfo] = useState({
        height: 170,
        weight: 70,
        goal: "Tăng cường sức khỏe"
    });

    useEffect(() => {
        const fetchProgress = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await authApis().get(endpoints['member-progress'], new FormData(), {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (!Array.isArray(res.data)) {
                    const errorMessage = res.data || "Lỗi khi tải tiến độ";
                    console.log("Error response:", errorMessage);

                    // Check if error is about missing MemberInfo
                    if (typeof errorMessage === 'string' && errorMessage.includes('Thông tin thành viên chưa được tạo')) {
                        setError("Thông tin thành viên chưa được tạo. Vui lòng tạo thông tin thành viên trước.");
                    } else {
                        setError(errorMessage);
                    }
                    setProgressList([]);
                    return;
                }

                const formatted = res.data.map((item) => {
                    console.log("Raw recordDate:", item.recordDate);

                    return {
                        ...item,
                        recordDate: formatDate(item.recordDate)
                    };
                });

                setProgressList(formatted);
            } catch (err) {
                console.error("Error fetching progress:", err);

                // Handle specific error responses
                if (err.response && err.response.data) {
                    const errorMessage = err.response.data;
                    if (typeof errorMessage === 'string' && errorMessage.includes('Thông tin thành viên chưa được tạo')) {
                        setError("Thông tin thành viên chưa được tạo. Vui lòng tạo thông tin thành viên trước.");
                    } else {
                        setError(errorMessage);
                    }
                } else {
                    setError("Không thể tải dữ liệu tiến độ!");
                }
                setProgressList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const handleCreateMemberInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('height', memberInfo.height);
            formData.append('weight', memberInfo.weight);
            formData.append('goal', memberInfo.goal);

            await authApis().post(endpoints['create-member-info'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Tạo thông tin thành viên thành công!");
            setShowCreateForm(false);

            // Reload progress data
            window.location.reload();
        } catch (err) {
            console.error("Error creating member info:", err);
            setError("Lỗi khi tạo thông tin thành viên: " + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Tiến độ Tập luyện của Bạn</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <div>
                    <Alert variant="danger">
                        {error}
                        {error.includes('Thông tin thành viên chưa được tạo') && (
                            <div className="mt-3">
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateForm(true)}
                                    disabled={loading}
                                >
                                    Tạo thông tin thành viên
                                </Button>
                            </div>
                        )}
                    </Alert>

                    {showCreateForm && (
                        <Alert variant="info">
                            <h5>Tạo thông tin thành viên</h5>
                            <Form onSubmit={handleCreateMemberInfo}>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chiều cao (cm)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={memberInfo.height}
                                                onChange={(e) => setMemberInfo({ ...memberInfo, height: e.target.value })}
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
                                                value={memberInfo.weight}
                                                onChange={(e) => setMemberInfo({ ...memberInfo, weight: e.target.value })}
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
                                                value={memberInfo.goal}
                                                onChange={(e) => setMemberInfo({ ...memberInfo, goal: e.target.value })}
                                                placeholder="Ví dụ: Tăng cường sức khỏe"
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
            ) : progressList.length === 0 ? (
                <Alert variant="info">Bạn chưa có tiến độ nào được ghi nhận.</Alert>
            ) : (
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
            )}
        </Container>
    );
};

export default MemberProgress;
