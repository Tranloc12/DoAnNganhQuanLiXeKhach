import Apis, { endpoints } from "../../configs/Apis";

export const getAllTrip = async () => {
    try {
        const response = await Apis.get(endpoints.trips);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch trips:", err);
        return [];
    }
};