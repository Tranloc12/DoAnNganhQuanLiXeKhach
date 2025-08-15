import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
// Thêm Alert và Spinner từ react-bootstrap vào đây
import { Alert, Spinner } from "react-bootstrap"; 

const AddRouteForm = () => {
    const navigate = useNavigate();

    const [route, setRoute] = useState({
        routeName: "",
        origin: "",
        destination: "",
        distanceKm: "",
        estimatedTravelTime: "",
        pricePerKm: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoute((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = {
                ...route,
                distanceKm: parseFloat(route.distanceKm),
                pricePerKm: parseFloat(route.pricePerKm),
            };

            await authApis().post(endpoints.routes, data);
            alert("✅ Đã thêm tuyến đường thành công!");
            navigate("/manager/routes");
        } catch (err) {
            console.error("❌ Lỗi khi thêm tuyến đường:", err);
            if (err.response && err.response.data) {
                setError(`Thêm tuyến đường thất bại: ${err.response.data.message || JSON.stringify(err.response.data)}`);
            } else {
                setError("Thêm tuyến đường thất bại. Vui lòng kiểm tra lại thông tin.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-xl shadow-lg bg-white">
            <h2 className="text-2xl font-semibold mb-6">Thêm Tuyến Đường Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <div>
                    <label className="block font-medium">Tên tuyến</label>
                    <input
                        type="text"
                        name="routeName"
                        value={route.routeName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Nơi đi</label>
                        <input
                            type="text"
                            name="origin"
                            value={route.origin}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Nơi đến</label>
                        <input
                            type="text"
                            name="destination"
                            value={route.destination}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Số km</label>
                        <input
                            type="number"
                            name="distanceKm"
                            value={route.distanceKm}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Giá mỗi km (VNĐ)</label>
                        <input
                            type="number"
                            name="pricePerKm"
                            value={route.pricePerKm}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Thời gian dự kiến</label>
                    <input
                        type="text"
                        name="estimatedTravelTime"
                        value={route.estimatedTravelTime}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md"
                        placeholder="Ví dụ: 6 hours hoặc 360 minutes"
                        required
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={route.isActive}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="font-medium">Kích hoạt</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    ) : (
                        "Thêm Tuyến Đường"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddRouteForm;