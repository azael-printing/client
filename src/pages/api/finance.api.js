import { http } from "./http";

// placeholder for next module
// export async function getFinanceSummary() {
//   const res = await http.get("/api/finance/summary");
//   return res.data;
// }
// import { http } from "./http";
// import { http } from "../api/http";

/**
 * Expected backend response shape for /api/finance/dashboard
 * {
 *   summary: {
 *     monthRevenue: 75485,
 *     monthExpenses: 5447,
 *     customerCredit: 7485,
 *     monthNetIncome: 8478,
 *     paidThisMonth: 75485
 *   },
 *   invoices: [
 *     {
 *       invoiceNo: "INV-2025-0012",
 *       jobId: "AZ-0012",
 *       customerName: "Abel Trading",
 *       total: 12500,
 *       paid: 12500,
 *       balance: 0,
 *       status: "Paid"
 *     }
 *   ]
 * }
 */
export async function getFinanceDashboard() {
  const res = await http.get("/api/finance/dashboard");
  return res.data;
}

/**
 * Expected backend response shape for /api/finance/expenses/dashboard
 * {
 *   summary: {
 *     totalVariableExpenses: 32485,
 *     totalFixedExpenses: 5447,
 *     governmentObligations: 7485,
 *     grandTotalMonthlyExpense: 8478
 *   },
 *   expenses: [
 *     {
 *       id: 1,
 *       description: "Vinyl Roll (EJET)",
 *       qty: 5,
 *       unitPrice: 8500,
 *       total: 42500,
 *       receipt: true,
 *       purchasedBy: "Fikade",
 *       category: "Materials"
 *     }
 *   ],
 *   reminders: [
 *     {
 *       title: "VAT Payment",
 *       body: "Due by 30th of the month."
 *     }
 *   ],
 *   insights: [
 *     "Watch fuel, outsourcing and stock purchases under Variable Expenses.",
 *     "Make sure all fixed payments are marked as Paid.",
 *     "Track VAT, salary tax and pension so there are no late penalties."
 *   ]
 * }
 */
export async function getExpenseDashboard() {
  const res = await http.get("/api/finance/expenses/dashboard");
  return res.data;
}

export async function listFinanceJobs(status) {
  const url = status
    ? `/api/jobs?status=${encodeURIComponent(status)}`
    : "/api/jobs";
  const res = await http.get(url);
  return res.data.jobs;
}

export async function financeAction(jobId, action) {
  const res = await http.post(`/api/jobs/${jobId}/workflow`, { action });
  return res.data.job;
}
