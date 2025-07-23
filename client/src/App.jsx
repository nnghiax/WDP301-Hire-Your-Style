import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgetPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import FilterProduct from "./pages/FilterProduct";
import StoreOwnerDashboard from "./pages/store-owner/ManageRevenuePage";
import StoreOwnerSidebar from "./components/store_owner/StoreOwnerSidebar";
import StoreOwnerProducts from "./pages/store-owner/ManageProductsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProfilePage from "./pages/auth/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StoreOwnerProfile from "./pages/store-owner/StoreOwnerProfilePage";
import RequestStore from "./pages/customer/RequestStorePage";
import AdminStoreRequest from "./pages/admin/AdminStoreRequestPage";
import AdminStoreRequestDetail from "./pages/admin/AdminStoreRequestDetailPage";
import RentalHistoryPage from "./pages/customer/RentalHistoryPage";
import RentalDashboard from "./components/admin/RentalDashboard";
import StoreOwnerBlog from "./pages/store-owner/ManageBlogsPage";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import PaymentCancelPage from "./components/customer/PaymentCancel";
import ManageRentalPage from "./pages/store-owner/ManageRentalPage";
import DepositDashboard from "./components/admin/DepositDashboard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminUserPage from "./pages/admin/AdminUserPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/filter-product" element={<FilterProduct />} />
        <Route
          path="/product-detail/:productId/:storeId"
          element={<ProductDetailPage />}
        />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />
        <Route path="/rental-history" element={<RentalHistoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/request" element={<RequestStore />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/detail/:blogId" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* Route store-owner */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/store-owner/dashboard"
            element={<StoreOwnerDashboard />}
          />
          <Route path="/store-owner/sidebar" element={<StoreOwnerSidebar />} />
          <Route
            path="/store-owner/products"
            element={<StoreOwnerProducts />}
          />
          <Route path="/store-owner/profile" element={<StoreOwnerProfile />} />
          <Route path="/store-owner/blog" element={<StoreOwnerBlog />} />
          <Route
            path="/store-owner/manager-rental"
            element={<ManageRentalPage />}
          />
        </Route>

        {/* Route admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductPage />} />
          <Route path="/admin/request" element={<AdminStoreRequest />} />
          <Route
            path="/admin/request/:requestId"
            element={<AdminStoreRequestDetail />}
          />
          <Route path="/admin/users" element={<AdminUserPage />} />
          <Route path="/admin/rental-dashboard" element={<RentalDashboard />} />
          <Route
            path="/admin/deposit-dashboard"
            element={<DepositDashboard />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
