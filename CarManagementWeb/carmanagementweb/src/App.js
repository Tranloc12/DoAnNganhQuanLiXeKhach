import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./user/Home.js";
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register";
import Login from "./components/Login";
import { MyDispatchContext, MyUserContext, AuthLoadingContext } from "./contexts/Contexts";
import { useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import ReviewList from "./components/review/ReviewList";
import EditReview from "./components/review/EditReview";
import { authApis, endpoints } from "./configs/Apis.js";
import { getValidToken, handleAuthError } from "./utils/authUtils";
import { ChatProvider } from "./contexts/ChatContext";
import ChatButton from "./components/chat/ChatButton";
import ChatPopup from "./components/chat/ChatPopup";
import DateTest from "./components/DateTest";
import ChatDemo from "./components/ChatDemo";
import AddTrainingProgress from "./components/trainer/AddTrainingProgress";
import MySubscription from "./components/member/MySubscription";
import Statistic from "./components/manager/Statistics";
import TrainerDashboard from "./components/trainer/TrainerDashboard";
import MemberProgress from "./components/member/MemberProgress";
import TrainerScheduleView from "./components/trainer/TrainerScheduleView";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ROLES } from "./utils/roleUtils";
import CreateSubscription from "./components/CreateSubscription";
import PaymentResult from "./components/PaymentResult";
import BusList from "./components/bus/BusList";
import TripList from "./components/trip/TripList";
import RouteList from "./components/route/RouteList";
import BookingPage from "./components/booking/BookingPage";
import TripBookingPage from "./components/trip/TripBookingPage.js";
import SeatBooking from "./components/booking/SeatBooking.js";
import TripManagement from "./components/manager/TripManagement.js";
import BusManagement from "./components/manager/BusManagement.js";
import UserManagement from "./components/manager/UserManagement.js";
import RouteManagement from "./components/manager/RouteManagement.js";
import AddBusForm from "./components/manager/AddBusForm.js";
import EditBusForm from "./components/manager/EditBusForm.js";
import AddUserForm from "./components/manager/AddUserForm.js";
import EditUserForm from "./components/manager/EditUserForm.js";
import AddRouteForm from "./components/manager/AddRouteForm.js";
import EditRouteForm from "./components/manager/EditRouteForm.js";
import AddTripForm from "./components/manager/AddTripForm.js";
import EditTripForm from "./components/manager/EditTripForm.js";
import AddReviewForm from "./components/review/AddReviewForm.js";
import AddScheduleForm from "./components/manager/AddScheduleForm.js";
import EditScheduleForm from "./components/manager/EditScheduleForm.js";
import ScheduleManagement from "./components/manager/ScheduleManagement.js";
import DriverSchedule from "./components/driver/DriverSchedule.js";
import ReviewManagement from "./components/manager/ReviewManagement.js";
import PayPalReturnHandler from "./services/PayPalReturnHandler.js";
import MyReviews from "./components/review/MyReviews.js";
import BookingHistory from "./components/booking/BookingHistory.js";
import TransactionHistory from "./components/payment/MyPayments.js";
import MyPayments from "./components/payment/MyPayments.js";
import Profile from "./components/passenger/Profile.js";
import EditPassword from "./components/passenger/EditPassword.js";
import TripTrackingPage from "./components/trip/TripTrackingPage.js";
import NotificationHandler from "./services/NotificationHandler.js";
import NotificationList from "./services/NotificationList.js";
import BusStationList from "./components/busstation/BusStationList.js";
import TransferPointList from "./components/transferPoint/TransferPointList.js";
import TripTransferList from "./components/transferPoint/TripTransferList.js";


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = getValidToken();
      if (token) {
        try {
          const res = await authApis().get(endpoints["current-user"]);
          console.log("User: " + JSON.stringify(res.data))

          // Kiểm tra response data có hợp lệ không
          if (res.data && res.data.id) {
            dispatch({ type: "login", payload: res.data });
          } else {
            throw new Error('Invalid user data');
          }
        } catch (error) {
          handleAuthError(error, dispatch);
        }
      }
      setIsAuthLoading(false);
    };
    getUser();
  }, []);

  return (
    <AuthLoadingContext.Provider value={isAuthLoading}>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <ChatProvider>
            <BrowserRouter>
              {/* BỌC TẤT CẢ CÁC PHẦN TỬ CON TRONG MỘT FRAGMENT DUY NHẤT */}
              <>
                <NotificationHandler />
                <Header />

                <Container>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/trips" element={<TripList />} />
                    <Route path="/routes" element={<RouteList />} />

                    <Route path="/book/:id" element={<SeatBooking />} />

                    <Route path="/trips/:id/book" element={<TripBookingPage />} />

                    <Route path="/success" element={<PayPalReturnHandler />} />


                    <Route path="/bookings" element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    } />

                    {/* Route để hiển thị lịch sử mua vé của người dùng hiện tại */}
                    <Route path="/bookings-history" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF, ROLES.PASSENGER]}>
                        <BookingHistory />
                      </ProtectedRoute>
                    } />

                    {/* Route cho TripManagement */}
                    <Route path="/trip-management" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <TripManagement />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/trips/add" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <AddTripForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/trips/edit/:id" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <EditTripForm />
                      </ProtectedRoute>
                    } />

                    {/* Thêm route cho UserManagement */}
                    <Route path="/user-management" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <UserManagement />
                      </ProtectedRoute>
                    } />

                    {/* Thêm route cho UserManagement */}
                    <Route path="/manager/routes" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <RouteManagement />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/routes/add" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <AddRouteForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/routes/edit/:id" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <EditRouteForm />
                      </ProtectedRoute>
                    } />

                    {/* Thêm route cho BusManagement từ vị trí mới */}
                    <Route path="/bus-management" element={
                      <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.STAFF]}>
                        <BusManagement />
                      </ProtectedRoute>
                    } />


                    <Route path="/manager/buses/add" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <AddBusForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/buses/edit/:id" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <EditBusForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/users/add" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <AddUserForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/users/edit/:id" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <EditUserForm />
                      </ProtectedRoute>
                    } />


                    {/* Route hiển thị reviews của một chuyến đi */}
                    <Route path="/trips/:tripId/reviews" element={<ReviewList />} />

                    {/* Routes cho Review Management */}
                    <Route path="/manager/reviews" element={
                      <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN, ROLES.STAFF]}>
                        <ReviewManagement />
                      </ProtectedRoute>
                    } />

                    {/* Route để hiển thị đánh giá của người dùng hiện tại */}
                    <Route path="/my-reviews" element={
                      <ProtectedRoute allowedRoles={[ROLES.PASSENGER, ROLES.ADMIN, ROLES.STAFF, ROLES.MANAGER, ROLES.DRIVER]}>
                        <MyReviews />
                      </ProtectedRoute>
                    } />

                    {/* Route để thêm review cho một chuyến đi cụ thể */}
                    <Route path="/trips/:tripId/reviews/add" element={
                      <ProtectedRoute allowedRoles={[ROLES.PASSENGER]}>
                        <AddReviewForm />
                      </ProtectedRoute>
                    } />

                    {/* Có thể thêm route edit review nếu cần */}
                    <Route path="/reviews/edit/:reviewId" element={
                      <ProtectedRoute allowedRoles={[ROLES.PASSENGER]}>
                        <EditReview />
                      </ProtectedRoute>
                    } />



                    {/* Routes cho Schedule Management */}
                    <Route path="/manager/schedules" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <ScheduleManagement />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/schedules/add" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        {/* Component để thêm lịch trình mới */}
                        <AddScheduleForm />
                      </ProtectedRoute>
                    } />

                    <Route path="/manager/schedules/edit/:id" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        {/* Component để sửa lịch trình */}
                        <EditScheduleForm />
                      </ProtectedRoute>
                    } />

                    {/* Routes cho Schedule Management */}
                    <Route path="/driver/schedules" element={
                      <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                        <DriverSchedule />
                      </ProtectedRoute>
                    } />


                    {/* Routes cho Review Management */}
                    <Route path="/manager/reviews" element={
                      <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN, ROLES.STAFF]}>
                        <ReviewManagement />
                      </ProtectedRoute>
                    } />

                    <Route path="/payments-history" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER, ROLES.STAFF, ROLES.PASSENGER]}>
                        <MyPayments />
                      </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.DRIVER, ROLES.STAFF, ROLES.PASSENGER]}>
                        <Profile />
                      </ProtectedRoute>
                    } />

                    <Route path="/change-password" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF, ROLES.DRIVER, ROLES.PASSENGER]}>
                        <EditPassword />
                      </ProtectedRoute>
                    } />


                    <Route path="/trips/:id/track" element={<TripTrackingPage />} />


                    <Route path="/notifi" element={
                      <ProtectedRoute allowedRoles={[ROLES.PASSENGER]}>
                        <NotificationList />
                      </ProtectedRoute>
                    } />

                    <Route path="/bus-stations" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <BusStationList />
                      </ProtectedRoute>
                    } />


                    <Route path="/transfer-points" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <TransferPointList />
                      </ProtectedRoute>
                    } />


                    <Route path="/trip-transfer" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
                        <TripTransferList />
                      </ProtectedRoute>
                    } />








                    {/* ------------------------------- */}



                    {/* Trainer only routes */}
                    <Route path="/progress-create" element={
                      <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                        <AddTrainingProgress />
                      </ProtectedRoute>
                    } />
                    <Route path="/trainer-progress" element={
                      <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                        <TrainerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/trainer-schedule-view" element={
                      <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                        <TrainerScheduleView />
                      </ProtectedRoute>
                    } />

                    {/* Member only routes */}
                    <Route path="/member-progress" element={
                      <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                        <MemberProgress />
                      </ProtectedRoute>
                    } />
                    <Route path="/my-subscriptions" element={
                      <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                        <MySubscription />
                      </ProtectedRoute>
                    } />




                    <Route path="/create-subscription" element={
                      <ProtectedRoute>
                        <CreateSubscription />
                      </ProtectedRoute>
                    } />
                    <Route path="/payment/return" element={
                      <ProtectedRoute>
                        <PaymentResult />
                      </ProtectedRoute>
                    } />
                    <Route path="/buses" element={<BusList />} />

                    {/* Admin only routes */}
                    <Route path="/statistics" element={
                      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Statistic />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat-demo" element={
                      <ProtectedRoute>
                        <ChatDemo />
                      </ProtectedRoute>
                    } />
                    <Route path="/date-test" element={<DateTest />} />
                  </Routes>
                </Container>
                <Footer />

                {/* Chat Components - chỉ hiển thị khi user đã đăng nhập */}
                {user && (
                  <>
                    <ChatButton />
                    <ChatPopup />
                  </>
                )}
              </>
            </BrowserRouter>
          </ChatProvider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </AuthLoadingContext.Provider>
  );
}

export default App;
