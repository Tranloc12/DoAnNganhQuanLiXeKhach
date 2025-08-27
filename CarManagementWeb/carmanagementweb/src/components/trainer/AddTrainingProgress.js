import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import dayjs from "dayjs";
import { authApis, endpoints } from "../../configs/Apis.js";

const AddTrainingProgress = () => {
    const [form, setForm] = useState({
        recordDate: "",
        weight: "",
        bodyFat: "",
        muscle: "",
        note: "",
    });

    const [searchParams] = useSearchParams();
    const memberId = searchParams.get("memberId");

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!memberId) {
            setError("Thiếu thông tin hội viên. Không thể thêm tiến độ.");
        }
    }, [memberId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const isFormValid = () => {
        return (
            form.recordDate &&
            form.weight !== "" &&
            form.bodyFat !== "" &&
            form.muscle !== ""
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!memberId) {
            alert("Không có ID hội viên. Không thể lưu.");
            return;
        }

        if (!isFormValid()) {
            alert("Vui lòng nhập đầy đủ các trường bắt buộc.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("recordDate", dayjs(form.recordDate).format("YYYY-MM-DD"));
            formData.append("weight", form.weight);
            formData.append("bodyFat", form.bodyFat);
            formData.append("muscle", form.muscle);
            formData.append("note", form.note);
            formData.append("memberInfoId", memberId);

            console.log("FormData gửi lên:", Object.fromEntries(formData.entries()));

            await authApis().post(endpoints["progress-create"], formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Thêm tiến độ tập luyện thành công!");
            navigate(-1);
        } catch (err) {
            console.error("Lỗi khi thêm tiến độ:", err.response?.data || err.message);
            alert("Lỗi khi thêm tiến độ: " + (err.response?.data || err.message));
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: 600 }}>
            <Card className="shadow-sm p-4 rounded-4">
                <h3 className="text-primary fw-bold mb-4 text-center">TẠO TIẾN ĐỘ TẬP LUYỆN</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                {!error && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="recordDate" className="mb-3">
                            <Form.Label>Ngày ghi nhận</Form.Label>
                            <Form.Control
                                type="date"
                                name="recordDate"
                                value={form.recordDate}
                                onChange={handleChange}
                                required
                                max={dayjs().format("YYYY-MM-DD")}
                            />
                        </Form.Group>

                        <Form.Group controlId="weight" className="mb-3">
                            <Form.Label>Cân nặng (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                name="weight"
                                value={form.weight}
                                onChange={handleChange}
                                required
                                min={0}
                                placeholder="Nhập cân nặng"
                            />
                        </Form.Group>

                        <Form.Group controlId="bodyFat" className="mb-3">
                            <Form.Label>Tỷ lệ mỡ (%)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                name="bodyFat"
                                value={form.bodyFat}
                                onChange={handleChange}
                                required
                                min={0}
                                max={100}
                                placeholder="Nhập tỷ lệ mỡ"
                            />
                        </Form.Group>

                        <Form.Group controlId="muscle" className="mb-3">
                            <Form.Label>Khối cơ (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                name="muscle"
                                value={form.muscle}
                                onChange={handleChange}
                                required
                                min={0}
                                placeholder="Nhập khối cơ"
                            />
                        </Form.Group>

                        <Form.Group controlId="note" className="mb-3">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                placeholder="Nhập ghi chú (nếu có)"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit" disabled={!isFormValid() || !memberId}>
                                Lưu Tiến Độ
                            </Button>
                        </div>
                    </Form>
                )}
            </Card>
        </Container>
    );
};

export default AddTrainingProgress;
