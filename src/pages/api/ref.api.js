import { http } from "./http";

export async function getCustomers(q = "") {
  const res = await http.get(`/api/ref/customers?q=${encodeURIComponent(q)}`);
  return res.data.items;
}
export async function addCustomer(name, phone) {
  const res = await http.post("/api/ref/customers", { name, phone });
  return res.data.item;
}

export async function getMachines(q = "") {
  const res = await http.get(`/api/ref/machines?q=${encodeURIComponent(q)}`);
  return res.data.items;
}
export async function addMachine(name) {
  const res = await http.post("/api/ref/machines", { name });
  return res.data.item;
}

export async function getItems(q = "") {
  const res = await http.get(`/api/ref/items?q=${encodeURIComponent(q)}`);
  return res.data.items;
}
export async function addItem(name, defaultUnit = "pcs") {
  const res = await http.post("/api/ref/items", { name, defaultUnit });
  return res.data.item;
}

//  ----------- Add price ----
export async function addPrice(
  itemId,
  machineId,
  unitPrice,
  vatEnabled = true,
  variant = null,
  variantLabel = null,
) {
  const res = await http.post("/api/ref/prices", {
    itemId,
    machineId,
    unitPrice,
    vatEnabled,
    variant,
    variantLabel,
  });
  return res.data.item;
}
export async function lookupPricesByItem(itemId) {
  const res = await http.get(
    `/api/ref/prices/lookup?itemId=${encodeURIComponent(itemId)}`,
  );
  return res.data.rules;
}
