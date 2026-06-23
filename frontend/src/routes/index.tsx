import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { StaffLayout } from '@/layouts/StaffLayout'
import { AdminRoute } from '@/routes/AdminRoute'
import { CustomerRoute } from '@/routes/CustomerRoute'
import { GuestRoute } from '@/routes/GuestRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { StaffRoute } from '@/routes/StaffRoute'

const HomePage = lazy(() => import('@/pages/landing/HomePage'))
const AboutPage = lazy(() => import('@/pages/landing/AboutPage'))
const ProductsPage = lazy(() => import('@/pages/marketplace/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/marketplace/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/marketplace/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('@/pages/checkout/OrderSuccessPage'))
const OrderHistoryPage = lazy(() => import('@/pages/orders/OrderHistoryPage'))
const OrderDetailPage = lazy(() => import('@/pages/orders/OrderDetailPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const CustomerDashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage'))
const CustomerProfilePage = lazy(() => import('@/pages/customer/CustomerProfilePage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'))
const InventoryPage = lazy(() => import('@/pages/admin/InventoryPage'))
const PondsPage = lazy(() => import('@/pages/admin/PondsPage'))
const FishBatchesPage = lazy(() => import('@/pages/admin/FishBatchesPage'))
const FeedingPage = lazy(() => import('@/pages/admin/FeedingPage'))
const HarvestPage = lazy(() => import('@/pages/admin/HarvestPage'))
const OrdersPage = lazy(() => import('@/pages/admin/orders/OrderManagementPage').then((m) => ({ default: m.OrderManagementPage })))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'))
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'))
const ActivityLogsPage = lazy(() => import('@/pages/admin/ActivityLogsPage'))
const UsersManagementPage = lazy(() => import('@/pages/admin/users/UsersManagementPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
}

function placeholderPage(eyebrow: string, title: string, description: string) {
  return <PagePlaceholder eyebrow={eyebrow} title={title} description={description} />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'about', element: withSuspense(<AboutPage />) },
      { path: 'products', element: withSuspense(<ProductsPage />) },
      { path: 'products/:id', element: withSuspense(<ProductDetailPage />) },
      { path: 'cart', element: withSuspense(<CartPage />) },
      { path: 'checkout', element: withSuspense(<CheckoutPage />) },
      { path: 'orders/success/:id', element: withSuspense(<OrderSuccessPage />) },
      {
        path: 'orders',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: withSuspense(<OrderHistoryPage />) },
          { path: ':id', element: withSuspense(<OrderDetailPage />) },
        ],
      },
      { path: 'unauthorized', element: withSuspense(<UnauthorizedPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
  {
    path: '/',
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: withSuspense(<LoginPage />) },
          { path: 'register', element: withSuspense(<RegisterPage />) },
        ],
      },
    ],
  },
  {
    path: '/customer',
    element: <ProtectedRoute />,
    children: [
      {
        element: <CustomerRoute />,
        children: [
          {
            element: <CustomerLayout />,
            children: [
              { index: true, element: withSuspense(<CustomerDashboardPage />) },
              { path: 'marketplace', element: withSuspense(<ProductsPage />) },
              { path: 'cart', element: withSuspense(<CartPage />) },
              { path: 'orders', element: <Navigate to="/orders" replace /> },
              {
                path: 'notifications',
                element: placeholderPage(
                  'Customer',
                  'Notifications',
                  'Halaman notifikasi pelanggan untuk melihat seluruh update order, pembayaran, dan aktivitas akun.',
                ),
              },
              {
                path: 'profile',
                element: withSuspense(<CustomerProfilePage />),
              },
              {
                path: 'settings',
                element: placeholderPage(
                  'Customer',
                  'Settings',
                  'Pengaturan pelanggan untuk notifikasi, keamanan akun, dan preferensi tampilan.',
                ),
              },
              { path: '*', element: withSuspense(<NotFoundPage />) },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/staff',
    element: <ProtectedRoute />,
    children: [
      {
        element: <StaffRoute />,
        children: [
          {
            element: <StaffLayout />,
            children: [
              {
                index: true,
                element: placeholderPage(
                  'Staff',
                  'Dashboard',
                  'Ringkasan operasional harian staff untuk pond, feeding, harvest, dan inventory.',
                ),
              },
              { path: 'ponds', element: withSuspense(<PondsPage />) },
              { path: 'fish-batches', element: withSuspense(<FishBatchesPage />) },
              { path: 'feeding', element: <Navigate to="/staff/feeding-logs" replace /> },
              { path: 'feeding-logs', element: withSuspense(<FeedingPage />) },
              { path: 'harvest', element: <Navigate to="/staff/harvests" replace /> },
              { path: 'harvests', element: withSuspense(<HarvestPage />) },
              { path: 'inventory', element: withSuspense(<InventoryPage />) },
              {
                path: 'profile',
                element: placeholderPage(
                  'Staff',
                  'Profile',
                  'Profil staff untuk melihat identitas akun dan detail akses operasional.',
                ),
              },
              {
                path: 'settings',
                element: placeholderPage(
                  'Staff',
                  'Settings',
                  'Pengaturan staff untuk notifikasi kerja, keamanan akun, dan preferensi aplikasi.',
                ),
              },
              { path: '*', element: withSuspense(<NotFoundPage />) },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: withSuspense(<AdminDashboardPage />) },
              { path: 'users', element: withSuspense(<UsersManagementPage />) },
              { path: 'products', element: withSuspense(<AdminProductsPage />) },
              { path: 'inventory', element: withSuspense(<InventoryPage />) },
              { path: 'ponds', element: withSuspense(<PondsPage />) },
              { path: 'fish-batches', element: withSuspense(<FishBatchesPage />) },
              { path: 'feeding', element: <Navigate to="/admin/feeding-logs" replace /> },
              { path: 'feeding-logs', element: withSuspense(<FeedingPage />) },
              { path: 'harvest', element: <Navigate to="/admin/harvests" replace /> },
              { path: 'harvests', element: withSuspense(<HarvestPage />) },
              { path: 'orders', element: withSuspense(<OrdersPage />) },
              { path: 'reports', element: withSuspense(<ReportsPage />) },
              { path: 'analytics', element: withSuspense(<AnalyticsPage />) },
              { path: 'notifications', element: withSuspense(<NotificationsPage />) },
              { path: 'activity-logs', element: withSuspense(<ActivityLogsPage />) },
              {
                path: 'profile',
                element: placeholderPage(
                  'Admin',
                  'Profile',
                  'Profil administrator untuk identitas akun, kontak, dan kendali akses pribadi.',
                ),
              },
              {
                path: 'settings',
                element: placeholderPage(
                  'Admin',
                  'Settings',
                  'Pusat pengaturan sistem untuk preferensi aplikasi, keamanan, dan konfigurasi operasional.',
                ),
              },
              { path: '*', element: withSuspense(<NotFoundPage />) },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
