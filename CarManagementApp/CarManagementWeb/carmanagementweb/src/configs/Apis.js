import axios from "axios";
import { getValidToken } from "../utils/authUtils";

// Cấu hình BASE_URL dựa trên environment
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/CarManagementApp/api";

export const endpoints = {
  register: "/register",
  login: "/login",
  currentUser: "/current-user",
  updateUser: "/current-user", // PATCH
  changePassword: "/change-password", // PATCH


  // --- User Management APIs ---
  users: "/users", // GET, POST
  userDetail: (id) => `/users/${id}`, // GET, PUT, DELETE
  drivers: "/drivers",
  driverDetail: (id) => `/drivers/${id}`, // GET, PUT, DELETE
  passengers: "/passengers",
  staff: "/staff",
  usersByRole: (role) => `/users/role/${role}`,
  myuploadAvatar: "/upload-avatar",


  // Payment
  createVnpayPayment: (id) => `/payment/vnpay/create-payment/${id}`,
  vnpayReturn: "/payment/vnpay/return",

  // Services
  services: "/services",
  testimonials: "/testimonials",

  // Bus APIs
  buses: "/buses",
  busDetail: (id) => `/buses/${id}`,
  updateBus: (id) => `/buses/${id}`,
  deleteBus: (id) => `/buses/${id}`,


  // Trip APIs
  trips: "/trips",
  tripDetail: (id) => `/trips/${id}`,
  updateTrip: (id) => `/trips/${id}`,
  deleteTrip: (id) => `/trips/${id}`,
  getTripById: (id) => `/trips/${id}`,

  // Route APIs
  routes: "/routes",
  routeDetail: (id) => `/routes/${id}`,
  updateRoute: (id) => `/routes/${id}`,
  deleteRoute: (id) => `/routes/${id}`,

  // Booking APIs
  bookings: "/bookings",
  myBookings: "/bookings/my",
  bookingDetail: (id) => `/bookings/${id}`,

  // Review APIs
  reviews: "/reviews", // Lấy tất cả review, có thể filter bằng ?kw=...
  reviewsByTrip: (tripId) => `/reviews/trip/${tripId}`, // Lấy review theo tripId
  addReview: (tripId) => `/reviews/trip/${tripId}`, // POST để thêm review
  deleteReview: (reviewId) => `/reviews/${reviewId}`, // DELETE để xóa review
  updateReview: (reviewId) => `/reviews/${reviewId}`,
  reviewDetail: (reviewId) => `/reviews/${reviewId}`,
  myReviews: "/reviews/my-reviews",


  //Schedules
  schedules: "/schedules", // GET all, POST
  scheduleDetail: (id) => `/schedules/${id}`,
  // --- Các Endpoint PayPal mới ---
  paypal: {
    createPayment: "/paypal/create-payment", // POST để tạo giao dịch PayPal
    executePayment: "/paypal/execute-payment" // GET để thực hiện giao dịch sau khi phê duyệt
  },


  //payment 
  myPayments: "/payments/my", // GET all, POST
  //MAP 
  busLocationUpdate: "/bus-locations/update", // POST
  busLocationLatest: (busId) => `/bus-locations/latest/${busId}`, // GET


  // --- BusStation APIs (Added) ---
  busStations: "/busstations/",
  busStationDetail: (id) => `/busstations/${id}`,

  // --- TransferPoint APIs ---
  transferPoints: "/transferpoints/", // GET, POST
  transferPointDetail: (id) => `/transferpoints/${id}`,

  // --- TripTransfer APIs ---
  tripTransfers: "/triptransfers", // GET all, POST
  tripTransferDetail: (id) => `/triptransfers/${id}`,






};

console.log("Endpoints in Apis.js:", endpoints);

// Axios instance có token
export const authApis = () => {
  const token = getValidToken();

  if (!token) {
    throw new Error("No valid token found");
  }

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Axios instance không cần token
export default axios.create({
  baseURL: BASE_URL,
});
