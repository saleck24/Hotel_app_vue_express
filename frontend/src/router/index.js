import { createRouter, createWebHistory } from "vue-router";

// Auth
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ForgotPassword from "../views/auth/ForgotPassword.vue";
import ResetPassword from "../views/auth/ResetPassword.vue";

// Admin
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminDashboard from "../views/admin/Dashboard.vue";

const routes = [
  // 🌍 PUBLIC
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password", component: ResetPassword },

  // 🔐 ADMIN (avec layout)
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "dashboard",
        component: AdminDashboard,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
