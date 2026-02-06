import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Ui from "./pages/ui.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import CreateProductPage from "./pages/CreateProductPage.jsx";
import EditProductPage from "./pages/EditProductPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import CheckOrderPage from "./pages/CheckOrder.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/carts" element={<CartPage />} />
          <Route path="/checkouts" element={<CheckoutPage />} />
          <Route path="/check-orders" element={<CheckOrderPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/products/detail" element={<ProductDetailPage />} />
          <Route path="/products/edit" element={<EditProductPage />} />
          <Route path="/ui" element={<Ui />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
