import Apis, { authApis, endpoints } from "../../configs/Apis";

// Lấy tất cả điểm trung chuyển
export const getAllTransferPoints = async () => {
  const res = await Apis.get(endpoints.transferPoints);
  return res.data;
};

// Lấy chi tiết theo id
export const getTransferPointById = async (id) => {
  const res = await Apis.get(endpoints.transferPointDetail(id));
  return res.data;
};

// Thêm mới
export const addTransferPoint = async (transferPoint) => {
  const res = await authApis().post(endpoints.transferPoints, transferPoint);
  return res.data;
};

// Cập nhật
export const updateTransferPoint = async (id, transferPoint) => {
  const res = await authApis().put(endpoints.transferPointDetail(id), transferPoint);
  return res.data;
};

// Xóa
export const deleteTransferPoint = async (id) => {
  await authApis().delete(endpoints.transferPointDetail(id));
};
