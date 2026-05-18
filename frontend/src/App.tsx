import { Routes, Route, Navigate } from "react-router-dom";

// Páginas Públicas
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgot-password";

// Páginas do Cliente (Arquivos que criamos)

// Componentes de Segurança
import { AuthGuard } from "./components/auth-guard";
import { Products } from "./pages/products";
import { Cart } from "./pages/cart";
import { Orders } from "./pages/orders";
import { DashboardLayout } from "./components/dashboard-layout";
import { OrderDetail } from "./pages/order-detail";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route path="/order" element={<Navigate to="/products" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
