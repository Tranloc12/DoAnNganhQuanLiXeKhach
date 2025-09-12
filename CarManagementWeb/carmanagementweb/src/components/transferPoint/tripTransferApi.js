import Apis, { authApis, endpoints } from "../../configs/Apis";

// Lấy tất cả TripTransfer
export const getAllTripTransfers = async () => {
    const res = await Apis.get(endpoints.tripTransfers);
    return res.data;
};

// Lấy chi tiết 1 TripTransfer
export const getTripTransferById = async (id) => {
    const res = await Apis.get(endpoints.tripTransferDetail(id));
    return res.data;
};

// Thêm mới TripTransfer
export const addTripTransfer = async (tripTransfer) => {
    const res = await authApis().post(endpoints.tripTransfers, tripTransfer);
    return res.data;
};

// Cập nhật TripTransfer
export const updateTripTransfer = async (id, tripTransfer) => {
    const res = await authApis().put(endpoints.tripTransferDetail(id), tripTransfer);
    return res.data;
};

// Xóa TripTransfer
export const deleteTripTransfer = async (id) => {
    await authApis().delete(endpoints.tripTransferDetail(id));
};
