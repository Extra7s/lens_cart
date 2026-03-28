import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import { PageLoader } from './components/Skeleton.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import CameraDetailPage from './pages/CameraDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';

function ProtectedAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppLayout() {
  const { loading } = useAuth();
  if (loading) return <PageLoader />;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/camera/:id" element={<CameraDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminPage /></ProtectedAdmin>} />
          <Route path="/admin/orders" element={<ProtectedAdmin><AdminOrdersPage /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppLayout />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
