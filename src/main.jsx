import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { AuthProvider, useAuth } from "./app/providers/AuthProvider";
import LoadingSplash from "./components/common/LoadingSplash";

import PublicLayout from "./app/layouts/PublicLayout";
import AppLayout from "./app/layouts/AppLayout";
import ProtectedRoute from "./app/guards/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Vision from "./pages/public/Vision";
import Mission from "./pages/public/Mission";
import Values from "./pages/public/Values";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import Feedback from "./pages/public/Feedback";
import Management from "./pages/public/Management";

import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/app/admin/AdminDashboard";
import CSDashboard from "./pages/app/cs/CSDashboard";
import DesignerDashboard from "./pages/app/designer/DesignerDashboard";
import OperatorDashboard from "./pages/app/operator/OperatorDashboard";
import FinanceDashboard from "./pages/app/finance/FinanceDashboard";

// Wireing routes in /app jobs
import CreateOrder from "./pages/app/jobs/CreateOrder";
import JobsList from "./pages/app/jobs/JobsList";
//
import OperatorRequests from "./pages/app/operator/OperatorRequests";
import InProduction from "./pages/app/operator/InProduction";
function BootGate({ children }) {
  const { booting } = useAuth();
  if (booting) return <LoadingSplash />;
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BootGate>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />}>
                <Route index element={<Vision />} />
                <Route path="vision" element={<Vision />} />
                <Route path="mission" element={<Mission />} />
                <Route path="values" element={<Values />} />
              </Route>
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/management" element={<Management />} />
              <Route path="/login" element={<Login />} />
            </Route>

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="cs" element={<CSDashboard />} />
              <Route path="designer" element={<DesignerDashboard />} />
              <Route path="operator" element={<OperatorDashboard />} />
              <Route path="finance" element={<FinanceDashboard />} />

              {/* ✅ jobs MUST be inside /app */}
              <Route path="create-order" element={<CreateOrder />} />
              <Route path="jobs" element={<JobsList />} />
              {/* ========= */}
              <Route path="operator-requests" element={<OperatorRequests />} />
              <Route path="in-production" element={<InProduction />} />

              <Route index element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BootGate>
    </AuthProvider>
  </React.StrictMode>,
);
