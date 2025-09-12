import Apis, { authApis, endpoints } from "../../configs/Apis";

// Lấy danh sách tất cả bến xe
export const getAllBusStations = async () => {
  try {
    let res = await Apis.get(endpoints.busStations);
    return res.data;
  } catch (err) {
    console.error("Error fetching bus stations:", err);
    throw err;
  }
};

// Lấy chi tiết 1 bến xe theo id
export const getBusStationById = async (id) => {
  try {
    let res = await Apis.get(endpoints.busStationDetail(id));
    return res.data;
  } catch (err) {
    console.error(`Error fetching bus station with id ${id}:`, err);
    throw err;
  }
};

// Thêm bến xe mới
export const addBusStation = async (busStation) => {
  try {
    let res = await authApis().post(endpoints.busStations, busStation);
    return res.data;
  } catch (err) {
    console.error("Error adding bus station:", err);
    throw err;
  }
};

// Cập nhật bến xe
export const updateBusStation = async (id, busStation) => {
  try {
    let res = await authApis().put(endpoints.busStationDetail(id), busStation);
    return res.data;
  } catch (err) {
    console.error(`Error updating bus station with id ${id}:`, err);
    throw err;
  }
};

// Xóa bến xe
export const deleteBusStation = async (id) => {
  try {
    await authApis().delete(endpoints.busStationDetail(id));
    return true;
  } catch (err) {
    console.error(`Error deleting bus station with id ${id}:`, err);
    throw err;
  }
};
