import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { AdminRoute } from '@/routes/AdminRoute'
import { CustomerRoute } from '@/routes/CustomerRoute'
import { GuestRoute } from '@/routes/GuestRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

const HomePage = lazy(() => import('@/pages/landing/HomePage'))
const AboutPage = lazy(() => import('@/pages/landing/AboutPage'))
const ProductsPage = lazy(() => import('@/pages/marketplace/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/marketplace/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/marketplace/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/marketplace/CheckoutPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const CustomerDashboardPage = lazy(
  () => import('@/pages/customer/CustomerDashboardPage'),
)
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'))
const InventoryPage = lazy(() => import('@/pages/admin/InventoryPage'))
const PondsPage = lazy(() => import('@/pages/admin/PondsPage'))
const FishBatchesPage = lazy(() => import('@/pages/admin/FishBatchesPage'))
const FeedingPage = lazy(() => import('@/pages/admin/FeedingPage'))
const HarvestPage = lazy(() => import('@/pages/admin/HarvestPage'))
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage'))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'))
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'))
const ActivityLogsPage = lazy(() => import('@/pages/admin/ActivityLogsPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
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
              { path: 'products', element: withSuspense(<AdminProductsPage />) },
              { path: 'inventory', element: withSuspense(<InventoryPage />) },
              { path: 'ponds', element: withSuspense(<PondsPage />) },
              { path: 'fish-batches', element: withSuspense(<FishBatchesPage />) },
              { path: 'feeding', element: withSuspense(<FeedingPage />) },
              { path: 'harvest', element: withSuspense(<HarvestPage />) },
              { path: 'orders', element: withSuspense(<OrdersPage />) },
              { path: 'reports', element: withSuspense(<ReportsPage />) },
              { path: 'analytics', element: withSuspense(<AnalyticsPage />) },
              { path: 'notifications', element: withSuspense(<NotificationsPage />) },
              { path: 'activity-logs', element: withSuspense(<ActivityLogsPage />) },
              { path: '*', element: withSuspense(<NotFoundPage />) },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
