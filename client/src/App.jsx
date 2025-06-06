import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgetPasswordPage from "./components/auth/ForgetPasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import FilterProduct from "./pages/customer/FilterProduct";
import StoreOwnerDashboard from "./components/store_owner/StoreOwnerDashboard";
import StoreOwnerSidebar from "./components/store_owner/StoreOwnerSidebar";
import StoreOwnerProducts from "./components/store_owner/ManageProducts";
import Revenue from "./components/store_owner/Revenue";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/filter-product" element={<FilterProduct />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />1

        {/* Route store-owner */}
        <Route path="/store-owner/dashboard" element={<StoreOwnerDashboard />} />
        <Route path="/store-owner/sidebar" element={<StoreOwnerSidebar />} />
        <Route path="/store-owner/products" element={<StoreOwnerProducts />} />
        <Route path="/store-owner/revenue" element={<Revenue />} />

        {/* Add more*/}
        

      </Routes>
    </Router>
  );
}

export default App;
