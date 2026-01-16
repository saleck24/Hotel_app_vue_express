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
