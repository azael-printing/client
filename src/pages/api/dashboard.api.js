import { http } from "./http";

export async function getAdminDashboard() {
  const res = await http.get("/api/dashboard/admin");
  return res.data;
}
