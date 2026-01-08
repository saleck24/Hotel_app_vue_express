import { createRouter, createWebHistory } from "vue-router";

// Auth
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ForgotPassword from "../views/auth/ForgotPassword.vue";
import ResetPassword from "../views/auth/ResetPassword.vue";

// Admin
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminDashboard from "../views/admin/Dashboard.vue";
import AdminReservations from "../views/admin/Reservations.vue";

// Client
import ClientLayout from "../layouts/ClientLayout.vue";
import ClientDashboard from "../views/client/Dashboard.vue";
import ClientReservations from "../views/client/Reservations.vue";

const routes = [
  // PUBLIC
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password", component: ResetPassword },

  // ADMIN (avec layout)
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", redirect: "/admin/dashboard" },
  {
    path: "dashboard",
    component: AdminDashboard,
  },
  {
    path: "profile",
    component: () => import("../views/admin/EditProfile.vue"),
  },
  {
    path: "reservations",
    component: AdminReservations,
  },
],
  },

  // CLIENT (avec layout)
  {
    path: "/client",
    component: ClientLayout,
    children: [
      { path: "", redirect: "/client/dashboard" },
  {
    path: "dashboard",
    component: ClientDashboard,
  },
  {
    path: "profile",
    component: () => import("../views/client/EditProfile.vue"),
  },
  {
    path: "reservations",
    component: ClientReservations,
  },
],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("Router guard - to:", to.path, "token:", !!token, "user:", user);

  // Routes publiques
  if (to.path === "/" || to.path.startsWith("/register") || to.path.startsWith("/forgot-password") || to.path.startsWith("/reset-password")) {
    console.log("Public route, allowing");
    next();
    return;
  }

  // Vérifier le token
  if (!token) {
    console.log("No token, redirecting to login");
    next("/");
    return;
  }

  // Si pas de rôle, rediriger vers login
  if (!user.role) {
    console.log("No role in user, redirecting to login");
    next("/");
    return;
  }

  // Vérifier le rôle pour les routes admin
  if (to.path.startsWith("/admin") && user.role !== "ADMIN") {
    console.log("Admin route but user is not admin, redirecting to client");
    next("/client/dashboard");
    return;
  }

  // Vérifier le rôle pour les routes client
  if (to.path.startsWith("/client") && user.role !== "CLIENT") {
    console.log("Client route but user is not client, redirecting to admin");
    next("/admin/dashboard");
    return;
  }

  console.log("Allowing navigation to:", to.path);
  next();
});

export default router;
