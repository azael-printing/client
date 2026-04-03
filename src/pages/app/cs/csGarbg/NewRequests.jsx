import { Navigate } from "react-router-dom";

export default function CSNewRequestsLegacyRedirect() {
  return <Navigate to="/app/cs/new" replace />;
}
