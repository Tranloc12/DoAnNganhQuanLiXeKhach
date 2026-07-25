import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { deleteBusStation, getAllBusStations, addBusStation } from "./busStationApi";

function LocationPicker({ setNewStation }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click: async (e) => {
            setPosition(e.latlng);

            try {
                // Gọi API Nominatim để lấy địa chỉ và thành phố
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&addressdetails=1`
                );
                const data = await res.json();

                const address = data.display_name || "Không rõ địa chỉ";
                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.state ||
                    "Không rõ thành phố";

                // Cập nhật form (chừa lại name để user nhập tay)
                setNewStation((prev) => ({
                    ...prev,
                    address: address,
                    city: city,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                }));
            } catch (err) {
                console.error("Lỗi khi lấy địa chỉ:", err);
            }
        },
    });

    return position ? <Marker position={position}></Marker> : null;
}

export default function BusStationList() {
    const [stations, setStations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newStation, setNewStation] = useState({
        name: "",
        address: "",
        city: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const data = await getAllBusStations();
                setStations(data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách bến xe:", err);
            }
        };
        fetchStations();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bến xe này?")) {
            try {
                await deleteBusStation(id);
                setStations((prev) => prev.filter((s) => s.id !== id));
            } catch (err) {
                console.error("Lỗi khi xóa bến xe:", err);
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const added = await addBusStation(newStation);
            setStations((prev) => [...prev, added]);
            setNewStation({ name: "", address: "", city: "", latitude: "", longitude: "" });
            setShowForm(false);
        } catch (err) {
            console.error("Lỗi khi thêm bến xe:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">📍 Danh sách bến xe</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowForm(!showForm)}
            >
                ➕ Thêm bến xe
            </button>

            {showForm && (
                <form onSubmit={handleAdd} className="border p-3 mb-3 rounded bg-light">
                    <div className="row mb-2">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên bến xe"
                                value={newStation.name}
                                onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Thành phố"
                                value={newStation.city}
                                onChange={(e) => setNewStation({ ...newStation, city: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Địa chỉ"
                        value={newStation.address}
                        onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                        required
                    />

                    {/* Map để chọn vị trí */}
                    <div style={{ height: "300px" }} className="mb-2">
                        <MapContainer
                            center={[10.762622, 106.660172]} // Mặc định là HCM
                            zoom={12}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationPicker setNewStation={setNewStation} />
                        </MapContainer>
                    </div>

                    <div className="row mb-2">
                        <div className="col">
                            <input
                                type="number"
                                step="0.000001"
                                className="form-control"
                                placeholder="Vĩ độ"
                                value={newStation.latitude}
                                readOnly
                            />
                        </div>
                        <div className="col">
                            <input
                                type="number"
                                step="0.000001"
                                className="form-control"
                                placeholder="Kinh độ"
                                value={newStation.longitude}
                                readOnly
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">Lưu</button>
                </form>
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên bến xe</th>
                        <th>Địa chỉ</th>
                        <th>Thành phố</th>
                        <th>Vĩ độ</th>
                        <th>Kinh độ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.address}</td>
                            <td>{s.city}</td>
                            <td>{s.latitude}</td>
                            <td>{s.longitude}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    {stations.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có bến xe nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
