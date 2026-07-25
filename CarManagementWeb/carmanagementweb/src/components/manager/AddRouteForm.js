import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Alert, Spinner } from "react-bootstrap";
import { FaBusSimple } from "react-icons/fa6";

const AddRouteForm = () => {
    const navigate = useNavigate();

    // State để lưu thông tin tuyến đường
    const [route, setRoute] = useState({
        routeName: "",
        origin: "", // Người dùng tự nhập
        destination: "", // Người dùng tự nhập
        distanceKm: "",
        estimatedTravelTime: "",
        pricePerKm: "",
        isActive: true,
        originStationId: "", // ID bến đi từ dropdown
        destinationStationId: "", // ID bến đến từ dropdown
    });

    // State để lưu danh sách bến xe
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch danh sách bến xe khi component mount
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const res = await authApis().get(endpoints.busStations);
                setStations(res.data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách bến xe:", err);
                setError("Không thể tải danh sách bến xe. Vui lòng thử lại.");
            }
        };
        fetchStations();
    }, []);

    // Xử lý thay đổi input và select
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
                originStationId: parseInt(route.originStationId, 10),
                destinationStationId: parseInt(route.destinationStationId, 10),
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
        <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center space-x-2">
                <FaBusSimple className="text-blue-600" />
                <span>Thêm Tuyến Đường Mới</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert variant="danger">{error}</Alert>}

                {/* --- */}

                {/* Dòng 1: Tên tuyến và Khoảng cách */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên tuyến</label>
                        <input
                            type="text"
                            name="routeName"
                            value={route.routeName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số km</label>
                        <input
                            type="number"
                            name="distanceKm"
                            value={route.distanceKm}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* --- */}

                {/* Dòng 2: Nơi đi và Nơi đến (Tự nhập) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nơi đi</label>
                        <input
                            type="text"
                            name="origin"
                            value={route.origin}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nơi đến</label>
                        <input
                            type="text"
                            name="destination"
                            value={route.destination}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* --- */}

                {/* Dòng 3: Bến đi và Bến đến (Dropdown) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chọn Bến đi</label>
                        <select
                            name="originStationId"
                            value={route.originStationId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Chọn bến xe --</option>
                            {stations.map((station) => (
                                <option key={station.id} value={station.id}>
                                    {station.name} ({station.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chọn Bến đến</label>
                        <select
                            name="destinationStationId"
                            value={route.destinationStationId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Chọn bến xe --</option>
                            {stations.map((station) => (
                                <option key={station.id} value={station.id}>
                                    {station.name} ({station.city})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- */}

                {/* Dòng 4: Thời gian và Giá */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thời gian dự kiến</label>
                        <input
                            type="text"
                            name="estimatedTravelTime"
                            value={route.estimatedTravelTime}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ví dụ: 6 hours"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá mỗi km (VNĐ)</label>
                        <input
                            type="number"
                            name="pricePerKm"
                            value={route.pricePerKm}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* --- */}

                {/* Dòng 5: Kích hoạt */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={route.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">Kích hoạt tuyến đường</label>
                </div>

                {/* --- */}

                {/* Nút gửi */}
                <button
                    type="submit"
                    className="w-full py-3 px-4 flex items-center justify-center space-x-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                        <span>Thêm Tuyến Đường</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddRouteForm;