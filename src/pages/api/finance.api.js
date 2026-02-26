import { http } from "./http";

// placeholder for next module
export async function getFinanceSummary() {
  const res = await http.get("/api/finance/summary");
  return res.data;
}
