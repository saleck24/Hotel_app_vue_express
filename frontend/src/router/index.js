import { createRouter, createWebHistory } from "vue-router";

// Layouts
import AdminLayout from "../layouts/AdminLayout.vue";
import ClientLayout from "../layouts/ClientLayout.vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";

// Auth Views
import Login from "../views/auth/LoginView.vue";
import Register from "../views/auth/RegisterView.vue";
import ForgotPassword from "../views/auth/ForgotPasswordView.vue";
import ResetPassword from "../views/auth/ResetPasswordView.vue";

// Public Views
import HomeView from "../views/public/HomeView.vue";
import RoomsView from "../views/public/RoomsView.vue";
import RoomDetailsView from "../views/public/RoomDetailsView.vue";

// Admin Views
import AdminDashboard from "../views/admin/DashboardView.vue";
import RoomsManager from "../views/admin/RoomsManagerView.vue";
import ReservationsManager from "../views/admin/ReservationsManagerView.vue";
import UsersView from "../views/admin/UsersView.vue";
import AdminChat from "../views/admin/ChatView.vue";
import AdminProfile from "../views/admin/ProfileView.vue";
import ReviewsManager from "../views/admin/ReviewsManagerView.vue";

// Client Views
import ClientDashboard from "../views/client/DashboardView.vue";
import MyReservations from "../views/client/MyReservationsView.vue";
import ClientProfile from "../views/client/ProfileView.vue";
import ClientChat from "../views/client/ChatView.vue";

const routes = [
  // PUBLIC
  { path: "/", name: "home", component: HomeView },
  { path: "/rooms", name: "rooms", component: RoomsView },
  { path: "/rooms/:id", name: "room-details", component: RoomDetailsView, meta: { requiresAuth: true } },

  // AUTH
  { path: "/login", name: "login", component: Login, meta: { guest: true } },
  { path: "/register", name: "register", component: Register, meta: { guest: true } },
  { path: "/forgot-password", name: "forgot-password", component: ForgotPassword, meta: { guest: true } },
  { path: "/reset-password", name: "reset-password", component: ResetPassword, meta: { guest: true } },

  // ADMIN (avec layout)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "ADMIN", layout: false },
    children: [
      { path: "", name: "admin-root", redirect: "/admin/dashboard" },
      { path: "dashboard", name: "admin-dashboard", component: AdminDashboard },
      { path: "rooms", name: "admin-rooms", component: RoomsManager },
      { path: "reservations", name: "admin-reservations", component: ReservationsManager },
      { path: "users", name: "admin-users", component: UsersView },
      { path: "profile", name: "admin-profile", component: AdminProfile },
      { path: "reviews", name: "admin-reviews", component: ReviewsManager },
      { path: "chat", name: "admin-chat", component: AdminChat },
    ],
  },

  // CLIENT (avec layout)
  {
    path: "/client",
    component: ClientLayout,
    meta: { requiresAuth: true, role: "CLIENT", layout: false },
    children: [
      { path: "", name: "client-root", redirect: "/client/dashboard" },
      { path: "dashboard", name: "client-dashboard", component: ClientDashboard },
      { path: "reservations", name: "client-reservations", component: MyReservations },
      { path: "profile", name: "client-profile", component: ClientProfile },
      { path: "chat", name: "client-chat", component: ClientChat },
    ],
  },

  // Fallback / legacy compatibility
  {
    path: "/dashboard", redirect: (to) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role === "ADMIN" ? "/admin/dashboard" : "/client/dashboard";
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guest);

  if (requiresAuth && !token) {
    return next({ name: "login" });
  }

  if (isGuestOnly && token) {
    return next(user.role === "ADMIN" ? "/admin/dashboard" : "/client/dashboard");
  }

  // Role check
  const requiredRole = to.matched.find(record => record.meta.role)?.meta.role;
  if (requiredRole && user.role !== requiredRole) {
    return next(user.role === "ADMIN" ? "/admin/dashboard" : "/client/dashboard");
  }

  next();
});

export default router;
