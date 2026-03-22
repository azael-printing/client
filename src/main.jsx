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
// import CSDashboard from "./pages/app/cs/CSDashboard";
import CSLayout from "./components/layouts/CsLayout";
import CSOverview from "./pages/app/cs/CSOverview";
import CSNewRequests from "./pages/app/cs/CSNewRequests";
import CSInDesign from "./pages/app/cs/CSInDesign";
import CSInProduction from "./pages/app/cs/CSInProduction";
import CSCompleted from "./pages/app/cs/CSCompleted";
import CSAudit from "./pages/app/cs/CSAudit";

// import DesignerDashboard from "./pages/app/designer/DesignerDashboard";
import DesignerLayout from "./components/layouts/DesignerLayout";
import DesignerOverview from "./pages/app/designer/DesignerOverview";
import DesignerQueue from "./pages/app/designer/DesignerQueue";
import DesignerInDesign from "./pages/app/designer/DesignerInDesign";
import DesignerCompleted from "./pages/app/designer/DesignerCompleted";
import DesignerAudit from "./pages/app/designer/DesignerAudit";

// import OperatorDashboard from "./pages/app/operator/OperatorDashboard";
import FinanceDashboard from "./pages/app/finance/FinanceDashboard";

//
import FinanceOverview from "./pages/app/finance/FinanceOverview";
import FinanceLayout from "./components/layouts/FinanceLayout";
import FinanceJobs from "./pages/app/finance/FinanceJobs";
import FinanceAudit from "./pages/app/finance/FinanceAudit";
// Wireing routes in /app jobs
import CreateOrder from "./pages/app/jobs/CreateOrder";
import JobsList from "./pages/app/jobs/JobsList";
//
// import FinanceDashboard
import FinanceExpensesDashboard from "./pages/app/finance/FinanceExpensesDashboard";
// import FinanceDashboard from "./pages/app/finance/FinanceDashboard";
//
import AdminProforma from "./pages/app/admin/AdminProforma";
import AdminInvoice from "./pages/app/admin/AdminInvoice";
//
import AdminLayout from "./components/layouts/AdminLayout";
//
import OperatorLayout from "./components/layouts/OperatorLayout";
import OperatorOverview from "./pages/app/operator/OperatorOverview";
import OperatorQueue from "./pages/app/operator/OperatorQueue";
import OperatorInProduction from "./pages/app/operator/OperatorInProduction";
import OperatorCompleted from "./pages/app/operator/OperatorCompleted";
import OperatorAudit from "./pages/app/operator/OperatorAudit";

// import FinanceWaiting from "./pages/app/finance/FinanceWaiting";
// import FinanceDoneTracking from "./pages/app/finance/FinanceDoneTracking";

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
              {/* ADMIN DASHBOARD WITH NESTED SIDEBAR  */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />

                <Route path="jobs" element={<JobsList />} />
                <Route path="create-order" element={<CreateOrder />} />
                <Route path="proforma" element={<AdminProforma />} />
                <Route path="invoice" element={<AdminInvoice />} />

                <Route path="finance">
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<FinanceDashboard />} />
                  <Route path="jobs" element={<FinanceJobs />} />
                  <Route path="audit" element={<FinanceAudit />} />
                  <Route
                    path="expenses"
                    element={<FinanceExpensesDashboard />}
                  />
                  <Route
                    path="revenue"
                    element={
                      <div className="p-6 font-bold text-zinc-600">
                        Revenue page coming next
                      </div>
                    }
                  />
                </Route>
              </Route>
              {/* ================== */}
              <Route path="operator" element={<OperatorLayout />}>
                <Route path="overview" element={<OperatorOverview />} />
                <Route path="queue" element={<OperatorQueue />} />
                <Route
                  path="in-production"
                  element={<OperatorInProduction />}
                />

                <Route path="completed" element={<OperatorCompleted />} />
                <Route path="audit" element={<OperatorAudit />} />
                <Route index element={<OperatorOverview />} />
              </Route>

              <Route path="cs" element={<CSLayout />}>
                <Route path="overview" element={<CSOverview />} />
                <Route path="create-order" element={<CreateOrder />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="new" element={<CSNewRequests />} />
                <Route path="design" element={<CSInDesign />} />
                <Route path="production" element={<CSInProduction />} />
                <Route path="completed" element={<CSCompleted />} />
                <Route path="audit" element={<CSAudit />} />
                <Route index element={<CSOverview />} />
              </Route>

              <Route path="designer" element={<DesignerLayout />}>
                <Route path="overview" element={<DesignerOverview />} />
                <Route path="queue" element={<DesignerQueue />} />
                <Route path="in-design" element={<DesignerInDesign />} />
                <Route path="completed" element={<DesignerCompleted />} />
                <Route path="audit" element={<DesignerAudit />} />
                <Route index element={<DesignerOverview />} />
              </Route>

              <Route path="finance" element={<FinanceLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<FinanceDashboard />} />
                <Route path="jobs" element={<FinanceJobs />} />
                <Route path="audit" element={<FinanceAudit />} />
                <Route path="expenses" element={<FinanceExpensesDashboard />} />
                <Route
                  path="revenue"
                  element={
                    <div className="p-6 font-bold text-zinc-600">
                      Revenue page coming next
                    </div>
                  }
                />
              </Route>
              {/* ✅ jobs MUST be inside /app */}
              <Route path="create-order" element={<CreateOrder />} />
              <Route path="jobs" element={<JobsList />} />
              {/* ========= */}

              {/* ==== */}
              <Route index element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BootGate>
    </AuthProvider>
  </React.StrictMode>,
);
