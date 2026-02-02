<<<<<<< Updated upstream
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
=======
import { createRouter, createWebHistory } from 'vue-router'
import ClientLayout from '../layouts/ClientLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/public/HomeView.vue')
        },
        {
            path: '/rooms',
            name: 'rooms',
            component: () => import('../views/public/RoomsView.vue')
        },
        {
            path: '/rooms/:id',
            name: 'room-details',
            component: () => import('../views/public/RoomDetailsView.vue')
        },
        {
            path: '/client',
            component: () => import('../views/client/DashboardView.vue'),
            meta: { layout: ClientLayout, requiresAuth: true, role: 'client' },
            children: [
                { path: '', name: 'client-dashboard', component: () => import('../views/client/DashboardView.vue') }, // or summary
                { path: 'reservations', name: 'client-reservations', component: () => import('../views/client/MyReservationsView.vue') },
                { path: 'profile', name: 'client-profile', component: () => import('../views/client/ProfileView.vue') },
                { path: 'chat', name: 'client-chat', component: () => import('../views/client/ChatView.vue') }
            ]
        },
        {
            path: '/admin',
            component: () => import('../views/admin/DashboardView.vue'), // Parent wrapper or dashboard
            meta: { layout: AdminLayout, requiresAuth: true, role: 'admin' },
            children: [
                { path: '', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
                { path: 'rooms', name: 'admin-rooms', component: () => import('../views/admin/RoomsManagerView.vue') },
                { path: 'reservations', name: 'admin-reservations', component: () => import('../views/admin/ReservationsManagerView.vue') },
                { path: 'users', name: 'admin-users', component: () => import('../views/admin/UsersView.vue') },
                { path: 'chat', name: 'admin-chat', component: () => import('../views/admin/ChatView.vue') }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/auth/LoginView.vue'),
            meta: { guest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/auth/RegisterView.vue'),
            meta: { guest: true }
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: () => import('../views/auth/ForgotPasswordView.vue'),
            meta: { guest: true }
        },
        {
            path: '/reset-password', // usually has token query param
            name: 'reset-password',
            component: () => import('../views/auth/ResetPasswordView.vue'),
            meta: { guest: true }
        }
    ]
})

export default router
>>>>>>> Stashed changes
