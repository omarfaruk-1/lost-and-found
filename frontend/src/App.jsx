import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";

import Dashboard from "./pages/Dashboard";
import BrowseItems from "./pages/items/BrowseItems";
import ItemDetails from "./pages/items/ItemDetails";
import CreateItem from "./pages/items/CreateItem";
import EditItem from "./pages/items/EditItem";
import MyItems from "./pages/items/MyItems";
import MyClaims from "./pages/claims/MyClaims";
import ClaimDetails from "./pages/claims/ClaimDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="/items" element={<BrowseItems />} />
        <Route path="/items/:itemId" element={<ItemDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />}
/>
        <Route path="/reset-password"element={<ResetPassword />}/>


        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items/new" element={<CreateItem />} />
          <Route path="/items/:itemId/edit" element={<EditItem />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/my-claims" element={<MyClaims />} />
          <Route path="/claims/:claimId" element={<ClaimDetails />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}