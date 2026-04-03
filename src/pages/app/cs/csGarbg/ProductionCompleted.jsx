import { Navigate } from "react-router-dom";

export default function CSProductionCompletedLegacyRedirect() {
  return <Navigate to="/app/cs/completed" replace />;
}
