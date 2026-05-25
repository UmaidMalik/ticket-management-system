import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import IncidentListPage from "@/pages/IncidentListPage";
import CreateIncidentPage from "@/pages/CreateIncidentPage";
import EditIncidentPage from "@/pages/EditIncidentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<IncidentListPage />} />
        <Route path="/incidents/new" element={<CreateIncidentPage />} />
        <Route path="/incidents/:id/edit" element={<EditIncidentPage />} />
      </Routes>
    </BrowserRouter>
  );
}