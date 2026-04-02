// //
// import crypto from "crypto";
// import { prisma } from "../../db/prismaClient.js";

// const genId = () => crypto.randomUUID();

// // ---------- Customers ----------
// export async function listCustomers(req, res) {
//   const q = (req.query.q || "").trim();
//   const items = await prisma.customer.findMany({
//     where: q
//       ? {
//           OR: [
//             { name: { contains: q, mode: "insensitive" } },
//             { phone: { contains: q, mode: "insensitive" } },
//           ],
//         }
//       : {},
//     orderBy: { createdAt: "desc" },
//     take: 200,
//   });
//   res.json({ items });
// }

// export async function createCustomer(req, res) {
//   const { name, phone } = req.body || {};
//   if (!name || !phone) {
//     return res.status(400).json({ message: "name and phone are required" });
//   }

//   const item = await prisma.customer.create({
//     data: {
//       id: genId(),
//       name: String(name).trim(),
//       phone: String(phone).trim(),
//     },
//   });

//   res.json({ item });
// }

// // ---------- Machines ----------
// export async function listMachines(req, res) {
//   const q = (req.query.q || "").trim();
//   const items = await prisma.machine.findMany({
//     where: q ? { name: { contains: q, mode: "insensitive" } } : {},
//     orderBy: { name: "asc" },
//     take: 200,
//   });
//   res.json({ items });
// }

// export async function createMachine(req, res) {
//   const { name } = req.body || {};
//   if (!name) return res.status(400).json({ message: "name is required" });

//   const item = await prisma.machine.create({
//     data: {
//       id: genId(),
//       name: String(name).trim(),
//     },
//   });

//   res.json({ item });
// }

// // ---------- Items ----------
// export async function listItems(req, res) {
//   const q = (req.query.q || "").trim();
//   const items = await prisma.item.findMany({
//     where: q ? { name: { contains: q, mode: "insensitive" } } : {},
//     orderBy: { name: "asc" },
//     take: 200,
//   });
//   res.json({ items });
// }

// export async function createItem(req, res) {
//   const { name, defaultUnit } = req.body || {};
//   if (!name) return res.status(400).json({ message: "name is required" });

//   const item = await prisma.item.create({
//     data: {
//       id: genId(),
//       name: String(name).trim(),
//       defaultUnit: String(defaultUnit || "pcs").trim(),
//     },
//   });

//   res.json({ item });
// }

// // ---------- Price Rules ----------
// export async function createPrice(req, res) {
//   const { itemId, machineId, unitPrice, vatEnabled } = req.body || {};
//   if (!itemId || !machineId) {
//     return res.status(400).json({ message: "itemId and machineId required" });
//   }

//   const price = Number(unitPrice);
//   if (!Number.isFinite(price) || price <= 0) {
//     return res.status(400).json({ message: "unitPrice must be positive" });
//   }

//   const item = await prisma.priceRule.upsert({
//     where: {
//       itemId_machineId: {
//         itemId: String(itemId),
//         machineId: String(machineId),
//       },
//     },
//     update: { unitPrice: price, vatEnabled: vatEnabled !== false },
//     create: {
//       id: genId(),
//       itemId: String(itemId),
//       machineId: String(machineId),
//       unitPrice: price,
//       vatEnabled: vatEnabled !== false,
//     },
//     include: { item: true, machine: true },
//   });

//   res.json({ item });
// }

// export async function lookupPrices(req, res) {
//   const { itemId } = req.query;
//   if (!itemId) return res.status(400).json({ message: "itemId is required" });

//   const rules = await prisma.priceRule.findMany({
//     where: { itemId: String(itemId) },
//     include: { machine: true, item: true },
//     orderBy: { machine: { name: "asc" } },
//   });

//   res.json({ rules });
// }
import crypto from "crypto";
import { prisma } from "../../db/prismaClient.js";

const genId = () => crypto.randomUUID();

function dbError(res, e) {
  console.error("REF API ERROR:", e);
  // Prisma “table missing” -> P2021
  if (e?.code === "P2021") {
    return res.status(500).json({
      message:
        "Reference tables not found in database. Create Customer/Machine/Item/PriceRule tables in Supabase SQL editor.",
    });
  }
  return res
    .status(500)
    .json({ message: e?.message || "Internal Server Error" });
}

// ---------- Customers ----------
export async function listCustomers(req, res) {
  try {
    const q = (req.query.q || "").trim();
    const items = await prisma.customer.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    res.json({ items });
  } catch (e) {
    return dbError(res, e);
  }
}

export async function createCustomer(req, res) {
  try {
    const { name, phone } = req.body || {};
    const n = String(name || "").trim();
    const p = String(phone || "").trim();

    if (!n || !p)
      return res.status(400).json({ message: "name and phone are required" });
    if (!/^\d{1,10}$/.test(p))
      return res
        .status(400)
        .json({ message: "phone must be digits only (max 10 digits)" });

    const item = await prisma.customer.create({
      data: { id: genId(), name: n, phone: p },
    });
    res.json({ item });
  } catch (e) {
    return dbError(res, e);
  }
}

// ---------- Machines ----------
export async function listMachines(req, res) {
  try {
    const q = (req.query.q || "").trim();
    const items = await prisma.machine.findMany({
      where: q ? { name: { contains: q, mode: "insensitive" } } : {},
      orderBy: { name: "asc" },
      take: 200,
    });
    res.json({ items });
  } catch (e) {
    return dbError(res, e);
  }
}

export async function createMachine(req, res) {
  try {
    const { name } = req.body || {};
    const n = String(name || "").trim();
    if (!n) return res.status(400).json({ message: "name is required" });

    const item = await prisma.machine.create({
      data: { id: genId(), name: n },
    });
    res.json({ item });
  } catch (e) {
    return dbError(res, e);
  }
}

// ---------- Items ----------
export async function listItems(req, res) {
  try {
    const q = (req.query.q || "").trim();
    const items = await prisma.item.findMany({
      where: q ? { name: { contains: q, mode: "insensitive" } } : {},
      orderBy: { name: "asc" },
      take: 200,
    });
    res.json({ items });
  } catch (e) {
    return dbError(res, e);
  }
}

export async function createItem(req, res) {
  try {
    const { name, defaultUnit } = req.body || {};
    const n = String(name || "").trim();
    if (!n) return res.status(400).json({ message: "name is required" });

    const item = await prisma.item.create({
      data: {
        id: genId(),
        name: n,
        defaultUnit: String(defaultUnit || "pcs").trim(),
      },
    });
    res.json({ item });
  } catch (e) {
    return dbError(res, e);
  }
}

// ---------- Price Rules ----------
// export async function createPrice(req, res) {
//   try {
//     const { itemId, machineId, unitPrice, vatEnabled } = req.body || {};
//     if (!itemId || !machineId)
//       return res.status(400).json({ message: "itemId and machineId required" });

//     const price = Number(unitPrice);
//     if (!Number.isFinite(price) || price <= 0)
//       return res.status(400).json({ message: "unitPrice must be positive" });

//     const item = await prisma.priceRule.upsert({
//       where: {
//         itemId_machineId: {
//           itemId: String(itemId),
//           machineId: String(machineId),
//         },
//       },
//       update: { unitPrice: price, vatEnabled: vatEnabled !== false },
//       create: {
//         id: genId(),
//         itemId: String(itemId),
//         machineId: String(machineId),
//         unitPrice: price,
//         vatEnabled: vatEnabled !== false,
//       },
//       include: { item: true, machine: true },
//     });

//     res.json({ item });
//   } catch (e) {
//     return dbError(res, e);
//   }
// }

// export async function lookupPrices(req, res) {
//   try {
//     const { itemId } = req.query;
//     if (!itemId) return res.status(400).json({ message: "itemId is required" });

//     const rules = await prisma.priceRule.findMany({
//       where: { itemId: String(itemId) },
//       include: { machine: true, item: true },
//       orderBy: { machine: { name: "asc" } },
//     });

//     res.json({ rules });
//   } catch (e) {
//     return dbError(res, e);
//   }
// }
// ---------- Price Rules ----------
export async function createPrice(req, res) {
  try {
    const { itemId, machineId, unitPrice, vatEnabled, variant, variantLabel } =
      req.body || {};
    if (!itemId || !machineId)
      return res.status(400).json({ message: "itemId and machineId required" });

    const price = Number(unitPrice);
    if (!Number.isFinite(price) || price <= 0)
      return res.status(400).json({ message: "unitPrice must be positive" });

    const v = String(
      variant || (vatEnabled === false ? "NON_VAT" : "VAT"),
    ).trim();
    const label = variantLabel ? String(variantLabel).trim() : null;

    const item = await prisma.priceRule.upsert({
      where: {
        itemId_machineId_variant: {
          itemId: String(itemId),
          machineId: String(machineId),
          variant: v,
        },
      },
      update: {
        unitPrice: price,
        vatEnabled: vatEnabled !== false,
        variantLabel: label,
      },
      create: {
        id: genId(),
        itemId: String(itemId),
        machineId: String(machineId),
        unitPrice: price,
        vatEnabled: vatEnabled !== false,
        variant: v,
        variantLabel: label,
      },
      include: { item: true, machine: true },
    });

    res.json({ item });
  } catch (e) {
    return dbError(res, e);
  }
}

export async function lookupPrices(req, res) {
  try {
    const { itemId } = req.query;
    if (!itemId) return res.status(400).json({ message: "itemId is required" });

    const rules = await prisma.priceRule.findMany({
      where: { itemId: String(itemId) },
      include: { machine: true, item: true },
      orderBy: [{ machine: { name: "asc" } }, { variant: "asc" }],
    });

    res.json({ rules });
  } catch (e) {
    return dbError(res, e);
  }
}
