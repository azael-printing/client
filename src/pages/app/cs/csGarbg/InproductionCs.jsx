import { Navigate } from "react-router-dom";

export default function CSInProductionLegacyRedirect() {
  return <Navigate to="/app/cs/production" replace />;
}
