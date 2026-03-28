export function formatJobId(jobNo) {
  const raw = String(jobNo ?? "").replace(/\D/g, "");
  if (!raw) return "AZ-0000";
  return `AZ-${raw.padStart(4, "0")}`;
}

export function exVatAmount(value, vatEnabled = true) {
  const n = Number(value || 0);
  if (!vatEnabled) return n;
  return n / 1.15;
}

export function roundedMoney(value) {
  return Number(value || 0).toLocaleString();
}
