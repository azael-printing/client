import { Navigate } from "react-router-dom";

export default function InProductionLegacyRedirect() {
  return <Navigate to="/app/operator/in-production" replace />;
}
