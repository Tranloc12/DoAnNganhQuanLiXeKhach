//package com.nhom12.controllers;
//
//import com.nhom12.pojo.User; // Represents users (admin, driver, staff, passenger)
//import com.nhom12.pojo.Bus; // Represents buses
//import com.nhom12.pojo.Route; // Represents routes
//import com.nhom12.pojo.Trip; // Represents trips
//import com.nhom12.pojo.Booking; // Represents bookings
//import com.nhom12.pojo.Payment; // Represents payments
//
//import com.nhom12.services.UserService;
//import com.nhom12.services.BusService;
//import com.nhom12.services.RouteService;
//import com.nhom12.services.TripService;
//import com.nhom12.services.BookingService; // Assuming you have this service
////import com.nhom12.services.PaymentService; // Assuming you have this service
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.servlet.mvc.support.RedirectAttributes;
//
//import java.security.Principal;
//import java.time.LocalDate;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Controller
//@RequestMapping("/admin")
//public class AdminController {
//
//    @Autowired
//    private UserService userService;
//    @Autowired
//    private BusService busService;
//    @Autowired
//    private RouteService routeService;
//    @Autowired
//    private TripService tripService;
//    @Autowired
//    private BookingService bookingService; // New: For booking-related stats
//    @Autowired
////    private PaymentService paymentService; // New: For revenue-related stats
//
//    // Helper method to check admin access and add current user to model
//    private String checkAdminAccess(Principal principal, Model model) {
//        if (principal == null) {
//            return "redirect:/login";
//        }
//        User currentUser = userService.getUserByUsername(principal.getName());
//        if (currentUser == null || !"admin".equals(currentUser.getUserRole())) { // Role from DB schema is lowercase 'admin'
//            return "redirect:/"; // Or "redirect:/access-denied"
//        }
//        model.addAttribute("currentUser", currentUser);
//        return null; // Access granted
//    }
//
//    /**
//     * Handles the main admin dashboard view, displaying overview metrics and a list of users.
//     */
//    @GetMapping("/")
//    public String adminDashboard(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) {
//            return accessCheck;
//        }
//
//        // --- Overall System Metrics for Dashboard Cards ---
//        // Counts based on your provided schema and assumed service methods
//        model.addAttribute("totalUsers", userService.countUsers(null));
//        model.addAttribute("totalPassengers", userService.countUsersByRole("passenger"));
//        model.addAttribute("totalDrivers", userService.countUsersByRole("driver"));
//        model.addAttribute("totalStaff", userService.countUsersByRole("staff")); // Assuming 'staff' role for ticket agents/other staff
//        model.addAttribute("totalAdmins", userService.countUsersByRole("admin"));
//        model.addAttribute("totalBuses", busService.countBuses());
//        model.addAttribute("totalRoutes", routeService.countRoutes());
//        model.addAttribute("totalTrips", tripService.countTrips()); // Total scheduled/completed trips
//        model.addAttribute("totalBookings", bookingService.countBookings()); // Total bookings made
//        model.addAttribute("totalRevenue", paymentService.getTotalRevenue()); // Overall total revenue from payments
//
//        // --- List of Users (for the table on the dashboard) ---
//        // You might want to add pagination or a limit to userService.getUsers() for a large dataset
//        model.addAttribute("users", userService.getUsers());
//
//        return "admin/dashboard"; // Assuming your dashboard HTML is at templates/admin/dashboard.html
//    }
//
//    /**
//     * Displays detailed reports and statistics for the bus management system.
//     */
//    @GetMapping("/reports")
//    public String reports(Model model, Principal principal,
//                          @RequestParam(name = "year", required = false) Integer year,
//                          @RequestParam(name = "month", required = false) Integer month) { // Added month as a parameter for specific monthly stats
//
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) {
//            return accessCheck;
//        }
//
//        // Default to current year and month if not provided
//        int currentYear = LocalDate.now().getYear();
//        int currentMonth = LocalDate.now().getMonthValue();
//
//        if (year == null) {
//            year = currentYear;
//        }
//        if (month == null) {
//            month = currentMonth;
//        }
//
//        model.addAttribute("selectedYear", year);
//        model.addAttribute("selectedMonth", month); // Pass selected month to view
//
//        // --- 1. Monthly Revenue Statistics (for Chart.js) ---
//        // Data for the entire year for the monthly revenue chart
//        List<Object[]> monthlyRevenueStats = paymentService.getMonthlyRevenueStats(year);
//        List<String> monthlyRevenueLabels = new ArrayList<>();
//        List<Double> monthlyRevenueData = new ArrayList<>();
//
//        if (monthlyRevenueStats != null) {
//            // Initialize all 12 months with 0 revenue
//            Map<Integer, Double> revenueMap = new HashMap<>();
//            for (int i = 1; i <= 12; i++) {
//                monthlyRevenueLabels.add("Tháng " + i);
//                revenueMap.put(i, 0.0);
//            }
//            // Populate with actual data
//            for (Object[] row : monthlyRevenueStats) {
//                if (row[0] instanceof Number && row[1] instanceof Number) {
//                    revenueMap.put(((Number) row[0]).intValue(), ((Number) row[1]).doubleValue());
//                }
//            }
//            // Ensure data is in order of months
//            for (int i = 1; i <= 12; i++) {
//                monthlyRevenueData.add(revenueMap.get(i));
//            }
//        }
//        model.addAttribute("monthlyRevenueLabels", monthlyRevenueLabels);
//        model.addAttribute("monthlyRevenueData", monthlyRevenueData);
//
//        // Get total revenue for the selected month (for summary card)
//        Double currentMonthTotalRevenue = paymentService.getTotalRevenueForMonth(month, year);
//        model.addAttribute("currentMonthTotalRevenue", currentMonthTotalRevenue != null ? currentMonthTotalRevenue : 0.0);
//
//
//        // --- 2. Trip Count by Route Statistics (for Chart.js) ---
//        // Data for the selected month/year
//        List<Object[]> tripCountByRouteStats = bookingService.getBookingCountByRoute(month, year); // Assuming this method exists
//        List<String> routeLabels = new ArrayList<>();
//        List<Long> tripCountsData = new ArrayList<>();
//
//        if (tripCountByRouteStats != null) {
//            for (Object[] row : tripCountByRouteStats) {
//                if (row[0] instanceof String && row[1] instanceof Number) {
//                    routeLabels.add((String) row[0]); // Route Name
//                    tripCountsData.add(((Number) row[1]).longValue()); // Count of bookings for that route
//                }
//            }
//        }
//        model.addAttribute("routeLabels", routeLabels);
//        model.addAttribute("tripCountsData", tripCountsData);
//
//
//        // --- 3. Hourly Trip Utilization Statistics (for Chart.js) ---
//        // Data for the selected month/year
//        List<Object[]> hourlyTripStats = tripService.getHourlyTripCounts(month, year); // Assuming this method exists
//        List<String> hourlyLabels = new ArrayList<>();
//        List<Long> hourlyData = new ArrayList<>();
//
//        // Initialize 24 hours with 0 counts
//        Map<Integer, Long> hourlyMap = new HashMap<>();
//        for (int i = 0; i < 24; i++) {
//            hourlyMap.put(i, 0L);
//            hourlyLabels.add(String.format("%02d:00", i));
//        }
//
//        if (hourlyTripStats != null) {
//            for (Object[] row : hourlyTripStats) {
//                if (row[0] instanceof Number && row[1] instanceof Number) {
//                    hourlyMap.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
//                }
//            }
//        }
//        // Populate hourlyData in order
//        for (int i = 0; i < 24; i++) {
//            hourlyData.add(hourlyMap.get(i));
//        }
//        model.addAttribute("hourlyLabels", hourlyLabels);
//        model.addAttribute("hourlyData", hourlyData);
//
//
//        return "admin/reports"; // Assuming your reports HTML is at templates/admin/reports.html
//    }
//
//    /**
//     * Displays a list of all users, with options for filtering by role.
//     */
//    @GetMapping("/users")
//    public String users(Model model, Principal principal,
//                        @RequestParam(name = "role", required = false) String role) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) {
//            return accessCheck;
//        }
//
//        Map<String, String> params = new HashMap<>();
//        if (role != null && !role.isEmpty()) {
//            params.put("role", role); // Pass role to service for filtering
//            model.addAttribute("selectedRole", role);
//        }
//
//        List<User> users = userService.getUsers(params); // Assuming getUsers can take params for filtering
//        model.addAttribute("users", users);
//
//        return "admin/users"; // Assuming your users HTML is at templates/admin/users.html
//    }
//
//    // --- New endpoints for managing specific entities ---
//
//    @GetMapping("/buses")
//    public String manageBuses(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("buses", busService.getBuses()); // Assuming getBuses() exists
//        return "admin/buses"; // New view for bus management
//    }
//
//    @GetMapping("/routes")
//    public String manageRoutes(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("routes", routeService.getRoutes()); // Assuming getRoutes() exists
//        return "admin/routes"; // New view for route management
//    }
//
//    @GetMapping("/trips")
//    public String manageTrips(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        // You might want to get trips for a specific date range or status
//        model.addAttribute("trips", tripService.getAllTrips()); // Assuming getAllTrips() exists
//        return "admin/trips"; // New view for trip management
//    }
//
//    @GetMapping("/bookings")
//    public String manageBookings(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("bookings", bookingService.getAllBookings()); // Assuming getAllBookings() exists
//        return "admin/bookings"; // New view for booking management
//    }
//
//    @GetMapping("/payments")
//    public String viewPayments(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("payments", paymentService.getAllPayments()); // Assuming getAllPayments() exists
//        return "admin/payments"; // New view for payment viewing
//    }
//
//    @GetMapping("/drivers")
//    public String manageDrivers(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("drivers", userService.getUsersByRole("driver")); // Assuming this returns List<User>
//        return "admin/drivers"; // New view for driver management
//    }
//
//    @GetMapping("/passengers")
//    public String managePassengers(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("passengers", userService.getUsersByRole("passenger")); // Assuming this returns List<User>
//        return "admin/passengers"; // New view for passenger management
//    }
//
//    @GetMapping("/staff")
//    public String manageStaff(Model model, Principal principal) {
//        String accessCheck = checkAdminAccess(principal, model);
//        if (accessCheck != null) return accessCheck;
//        model.addAttribute("staff", userService.getUsersByRole("staff")); // Assuming this returns List<User>
//        return "admin/staff"; // New view for general staff management
//    }
//}