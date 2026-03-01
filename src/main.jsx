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

import DesignerDashboard from "./pages/app/designer/DesignerDashboard";
import OperatorDashboard from "./pages/app/operator/OperatorDashboard";
// import FinanceDashboard from "./pages/app/finance/FinanceDashboard";

//
import FinanceOverview from "./pages/app/finance/FinanceOverview";
import FinanceLayout from "./components/layouts/FinanceLayout";
import FinanceJobs from "./pages/app/finance/FinanceJobs";
import FinanceAudit from "./pages/app/finance/FinanceAudit";
// Wireing routes in /app jobs
import CreateOrder from "./pages/app/jobs/CreateOrder";
import JobsList from "./pages/app/jobs/JobsList";
//
import NewRequests from "./pages/app/cs/NewRequests";
import InProductionCS from "./pages/app/cs/InproductionCs";

// import DesignAssigned from "./pages/app/designer/DesignAssigned";
// import InDesign from "./pages/app/designer/InDesign";
import DesignCompleted from "./pages/app/cs/DesignCompleted";
import ProductionCompleted from "./pages/app/cs/ProductionCompleted";

import DesignAssigned from "./pages/app/designer/DesignAssigned";
import InDesign from "./pages/app/designer/InDesign";

import OperatorRequests from "./pages/app/operator/OperatorRequests";
import InProduction from "./pages/app/operator/InProduction";

import FinanceWaiting from "./pages/app/finance/FinanceWaiting";
import FinanceDoneTracking from "./pages/app/finance/FinanceDoneTracking";

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
              {/* <Route path="cs" element={<CSDashboard />} /> */}
              <Route path="designer" element={<DesignerDashboard />} />
              <Route path="operator" element={<OperatorDashboard />} />
              {/* <Route path="finance" element={<FinanceDashboard />} /> */}
              {/*  */}

              <Route path="cs" element={<CSLayout />}>
                <Route path="overview" element={<CSOverview />} />
                <Route path="new" element={<CSNewRequests />} />
                <Route path="design" element={<CSInDesign />} />
                <Route path="production" element={<CSInProduction />} />
                <Route path="completed" element={<CSCompleted />} />
                <Route path="audit" element={<CSAudit />} />
                <Route index element={<CSOverview />} />
              </Route>

              <Route path="finance" element={<FinanceLayout />}>
                <Route path="overview" element={<FinanceOverview />} />
                <Route path="jobs" element={<FinanceJobs />} />
                <Route path="audit" element={<FinanceAudit />} />

                {/* keep these pages for later; we will implement */}
                <Route
                  path="revenue"
                  element={
                    <div className="p-6 font-bold text-zinc-600">
                      Revenue (next)
                    </div>
                  }
                />
                <Route
                  path="expenses"
                  element={
                    <div className="p-6 font-bold text-zinc-600">
                      Expenses (next)
                    </div>
                  }
                />

                <Route index element={<FinanceOverview />} />
              </Route>
              {/* ✅ jobs MUST be inside /app */}
              <Route path="create-order" element={<CreateOrder />} />
              <Route path="jobs" element={<JobsList />} />
              {/* ========= */}

              {/* ====== */}
              <Route path="cs-design-completed" element={<DesignCompleted />} />
              <Route
                path="cs-production-completed"
                element={<ProductionCompleted />}
              />
              <Route path="cs-new-requests" element={<NewRequests />} />
              <Route path="cs-in-production" element={<InProductionCS />} />

              <Route path="finance-waiting" element={<FinanceWaiting />} />
              <Route path="finance-done" element={<FinanceDoneTracking />} />

              <Route path="designer-assigned" element={<DesignAssigned />} />
              <Route path="designer-in-design" element={<InDesign />} />

              <Route path="operator-requests" element={<OperatorRequests />} />
              <Route path="operator-in-production" element={<InProduction />} />
              {/* ==== */}
              <Route index element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BootGate>
    </AuthProvider>
  </React.StrictMode>,
);
