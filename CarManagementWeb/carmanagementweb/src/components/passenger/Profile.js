import React, { useState, useEffect, useRef, useContext } from "react"; // THÊM useContext
import { Button, Alert, Spinner, Badge } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyDispatchContext, MyUserContext } from "../../contexts/Contexts"; // THÊM MyUserContext và MyDispatchContext

// Hàm format ngày (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
    } catch (e) {
        console.error("Lỗi định dạng ngày:", e);
        return "";
    }
};

const Profile = () => {
    // Sử dụng MyUserContext và MyDispatchContext
    const currentUserContext = useContext(MyUserContext); // Lấy user hiện tại từ context nếu cần
    const dispatch = useContext(MyDispatchContext); // Lấy dispatch để cập nhật context

    const [user, setUser] = useState(null); // State local cho component Profile
    const [loadingUser, setLoadingUser] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const messageTimeoutRef = useRef(null);

    // Avatar
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const avatarFileInputRef = useRef(null);

    // Lấy thông tin user
    const fetchUserProfile = async () => {
        try {
            setLoadingUser(true);
            const api = authApis();
            const res = await api.get(endpoints.currentUser);

            const userData = res.data;
            if (userData.dob) userData.dob = formatDateForInput(userData.dob);

            setUser(userData);
            setFormData(userData);
            // Cập nhật MyUserContext ngay khi load profile
            dispatch({ type: "login", payload: userData }); 

        } catch (err) {
            console.error("❌ Lỗi khi tải thông tin:", err);
            setMessage({
                type: "danger",
                text: "Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.",
            });
            setUser(null);
            dispatch({ type: "logout" }); // Đảm bảo context được reset nếu có lỗi
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
        return () => {
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        };
    }, []);

    // Xử lý input thay đổi
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Chọn file ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // Upload avatar
    const handleUploadAvatar = async () => {
        if (!selectedFile) {
            setMessage({ type: "warning", text: "Vui lòng chọn ảnh trước!" });
            return;
        }

        try {
            setUploading(true);
            const api = authApis();

            const formDataUpload = new FormData();
            formDataUpload.append("file", selectedFile);

            const res = await api.post(endpoints.myuploadAvatar, formDataUpload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // ✅ cập nhật avatar mới ngay lập tức vào state cục bộ
            const newAvatarUrl = res.data.url;
            const updatedUserLocal = { ...user, avatar: newAvatarUrl };
            setUser(updatedUserLocal);
            setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));

            // ⭐ QUAN TRỌNG: CẬP NHẬT MYUSERCONTEXT ĐỂ HEADER NHẬN BIẾT ĐƯỢC
            dispatch({ type: "login", payload: updatedUserLocal }); // Gửi hành động cập nhật context

            setPreview(null);
            setSelectedFile(null);
            if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";

            setMessage({ type: "success", text: res.data.message || "Ảnh đại diện đã được cập nhật!" });
        } catch (err) {
            console.error("❌ Upload thất bại:", err.response?.data || err.message);
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Lỗi không xác định.";
            setMessage({ type: "danger", text: `Upload thất bại: ${errorMessage}` });
        } finally {
            setUploading(false);
        }
    };

    // Cập nhật thông tin user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const api = authApis();

            // Chuyển dob về ISO format trước khi gửi
            const dataToUpdate = {
                ...formData,
                dob: formData.dob ? new Date(formData.dob).toISOString() : null,
            };

            const res = await api.patch(endpoints.updateUser, dataToUpdate);
            const updatedUserData = res.data;

            if (updatedUserData.dob)
                updatedUserData.dob = formatDateForInput(updatedUserData.dob);

            setUser(updatedUserData); // Cập nhật state local
            setFormData(updatedUserData); // Cập nhật formData

            // ⭐ QUAN TRỌNG: CẬP NHẬT MYUSERCONTEXT SAU KHI CẬP NHẬT THÔNG TIN CHUNG
            dispatch({ type: "login", payload: updatedUserData }); // Gửi hành động cập nhật context

            setMessage({ type: "success", text: "Cập nhật thành công!" });
            setEditing(false);

            messageTimeoutRef.current = setTimeout(() => {
                setMessage({ type: "", text: "" });
            }, 3000);
        } catch (err) {
            console.error("❌ Lỗi cập nhật:", err);
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Lỗi không xác định.";
            setMessage({ type: "danger", text: `Cập nhật thất bại: ${errorMessage}` });
        } finally {
            setSaving(false);
        }
    };

    // Loading state
    if (loadingUser && !user) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <Spinner animation="border" variant="primary" className="me-2" />
                <p className="text-muted fs-5">Đang tải thông tin...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <Alert variant="danger" className="d-flex align-items-center">
                    <span className="me-2" style={{ fontSize: "24px" }}>❌</span>
                    {message.text ||
                        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."}
                </Alert>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="card shadow-lg rounded-3 border-0">
                <div className="card-body p-4 p-md-5">
                    <h2 className="card-title text-center mb-4 fw-bold text-primary">
                        👤 Thông tin tài khoản
                    </h2>

                    {message.text && (
                        <Alert variant={message.type} className="text-center fw-medium">
                            {message.text}
                        </Alert>
                    )}

                    {/* Avatar */}
                    <div className="d-flex flex-column align-items-center mb-4">
                        <img
                            src={
                                preview ||
                                (user.avatar
                                    ? user.avatar.replace("http://", "https://") + `?t=${new Date().getTime()}`
                                    : "https://placehold.co/150x150/ADD8E6/000000?text=Avatar")

                            }
                            alt="Avatar" className="rounded-circle mb-3 border border-3 border-primary shadow" style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <div className="mt-2 d-flex flex-column align-items-center">
                            <input
                                type="file"
                                ref={avatarFileInputRef}
                                onChange={handleFileChange}
                                className="form-control mb-2"
                                accept="image/*"
                                style={{ maxWidth: "250px" }}
                                disabled={uploading}
                            />
                            <Button
                                variant="outline-primary"
                                onClick={handleUploadAvatar}
                                disabled={!selectedFile || uploading}
                                className="d-flex align-items-center"
                            >
                                {uploading ? (
                                    <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                                ) : (
                                    <span className="me-2">⬆️</span>
                                )}
                                Tải ảnh đại diện
                            </Button>
                        </div>

                        <h3 className="fw-semibold text-dark mt-3">
                            {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-muted">@{user.username}</p>
                        <Badge bg="info">{user.userRole}</Badge>
                    </div>

                    {/* Form cập nhật */}
                    <form onSubmit={handleSubmit}>
                        {/* họ tên */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Họ</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    disabled={!editing}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Tên</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        {/* email */}
                        <div className="mb-3">
                            <label className="form-label fw-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                                className="form-control"
                                disabled={!editing}
                            />
                        </div>

                        {/* ngày sinh */}
                        <div className="mb-3">
                            <label className="form-label fw-medium">Ngày sinh</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob || ""}
                                onChange={handleInputChange}
                                className="form-control"
                                disabled={!editing}
                            />
                        </div>

                        {/* phone */}
                        <div className="mb-3">
                            <label className="form-label fw-medium">Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                                className="form-control"
                                disabled={!editing}
                            />
                        </div>

                        {/* địa chỉ */}
                        <div className="mb-4">
                            <label className="form-label fw-medium">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                                className="form-control"
                                disabled={!editing}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            {!editing ? (
                                <Button variant="primary" onClick={() => setEditing(true)}>
                                    ✏️ Chỉnh sửa
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData(user);
                                            setMessage({ type: "", text: "" });
                                        }}
                                    >
                                        ❌ Hủy
                                    </Button>
                                    <Button type="submit" variant="success" disabled={saving}>
                                        {saving ? (
                                            <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                                        ) : (
                                            "💾 Lưu"
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
