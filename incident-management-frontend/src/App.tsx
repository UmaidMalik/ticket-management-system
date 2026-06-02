import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import IncidentListPage from "@/pages/IncidentListPage";
import CreateIncidentPage from "@/pages/CreateIncidentPage";
import EditIncidentPage from "@/pages/EditIncidentPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AccountPage from "@/pages/AccountPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import EditorRoute from "@/components/EditorRoute";
import UserManagementPage from "@/pages/UserManagementPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<IncidentListPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/incidents/:id/edit" element={<EditIncidentPage />} />
        </Route>

        <Route element={<EditorRoute />}>
          <Route path="/incidents/new" element={<CreateIncidentPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}