import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { getAllTransferPoints, addTransferPoint, deleteTransferPoint } from "./transferPointApi";
import { getAllBusStations } from "../busstation/busStationApi";

function LocationPicker({ setNewPoint }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click: async (e) => {
            setPosition(e.latlng);

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&addressdetails=1`
                );
                const data = await res.json();

                const address = data.display_name || "Không rõ địa chỉ";
                const city =
                    data.address.city || data.address.town || data.address.village || data.address.state || "Không rõ thành phố";

                setNewPoint((prev) => ({
                    ...prev,
                    address,
                    city,
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

export default function TransferPointList() {
    const [points, setPoints] = useState([]);
    const [stations, setStations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newPoint, setNewPoint] = useState({
        name: "",
        address: "",
        city: "",
        latitude: "",
        longitude: "",
        stationId: "", // liên kết với BusStation
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tpData, stationData] = await Promise.all([getAllTransferPoints(), getAllBusStations()]);
                setPoints(tpData);
                setStations(stationData);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            }
        };
        fetchData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const added = await addTransferPoint(newPoint);
            setPoints((prev) => [...prev, added]);
            setShowForm(false);
            setNewPoint({ name: "", address: "", city: "", latitude: "", longitude: "", stationId: "" });
        } catch (err) {
            console.error("Lỗi khi thêm điểm trung chuyển:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa điểm trung chuyển này?")) {
            try {
                await deleteTransferPoint(id);
                setPoints((prev) => prev.filter((p) => p.id !== id));
            } catch (err) {
                console.error("Lỗi khi xóa:", err);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>🚏 Danh sách điểm trung chuyển</h2>
            <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
                ➕ Thêm điểm trung chuyển
            </button>

            {showForm && (
                <form onSubmit={handleAdd} className="border p-3 mb-3 rounded bg-light">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Tên điểm"
                        value={newPoint.name}
                        onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                        required
                    />
                    <select
                        className="form-control mb-2"
                        value={newPoint.stationId?.id || ""}
                        onChange={(e) =>
                            setNewPoint({ ...newPoint, stationId: { id: parseInt(e.target.value) } })
                        }
                        required
                    >
                        <option value="">-- Chọn bến xe gốc --</option>
                        {stations.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>

                    <input type="text" className="form-control mb-2" placeholder="Địa chỉ" value={newPoint.address} readOnly />
                    <input type="text" className="form-control mb-2" placeholder="Thành phố" value={newPoint.city} readOnly />

                    <div style={{ height: "300px" }} className="mb-2">
                        <MapContainer center={[10.762622, 106.660172]} zoom={12} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationPicker setNewPoint={setNewPoint} />
                        </MapContainer>
                    </div>

                    <button type="submit" className="btn btn-success">
                        Lưu
                    </button>
                </form>
            )}

            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Địa chỉ</th>
                        <th>Thành phố</th>
                        <th>Vĩ độ</th>
                        <th>Kinh độ</th>
                        <th>Bến xe gốc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {points.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.address}</td>
                            <td>{p.city}</td>
                            <td>{p.latitude}</td>
                            <td>{p.longitude}</td>
                            <td>{p.stationId?.name}</td>
                            <td>
                                <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    {points.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Không có điểm trung chuyển nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
