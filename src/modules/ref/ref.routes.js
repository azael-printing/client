// import { Router } from "express";
// import { asyncHandler } from "../../utils/asyncHandler.js";
// import { requireAuth, requireRole } from "../auth/auth.middleware.js";
// import {
//   listCustomers,
//   createCustomer,
//   listMachines,
//   createMachine,
//   listItems,
//   createItem,
//   listPrices,
//   createPrice,
//   lookupPrices,
// } from "./ref.controller.js";

// const router = Router();

// // Admin + CS can manage reference data
// const allow = requireRole("ADMIN", "CS");

// // customers
// router.get("/customers", requireAuth, allow, asyncHandler(listCustomers));
// router.post("/customers", requireAuth, allow, asyncHandler(createCustomer));

// // machines
// router.get("/machines", requireAuth, allow, asyncHandler(listMachines));
// router.post("/machines", requireAuth, allow, asyncHandler(createMachine));

// // items
// router.get("/items", requireAuth, allow, asyncHandler(listItems));
// router.post("/items", requireAuth, allow, asyncHandler(createItem));

// // prices
// router.get("/prices", requireAuth, allow, asyncHandler(listPrices));
// router.post("/prices", requireAuth, allow, asyncHandler(createPrice));
// router.get("/prices/lookup", requireAuth, allow, asyncHandler(lookupPrices));

// export default router;
import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import {
  listCustomers,
  createCustomer,
  listMachines,
  createMachine,
  listItems,
  createItem,
  createPrice,
  lookupPrices,
} from "./ref.controller.js";

const router = Router();

// Admin + CS can manage reference data
const allow = requireRole("ADMIN", "CS");

// customers
router.get("/customers", requireAuth, allow, asyncHandler(listCustomers));
router.post("/customers", requireAuth, allow, asyncHandler(createCustomer));

// machines
router.get("/machines", requireAuth, allow, asyncHandler(listMachines));
router.post("/machines", requireAuth, allow, asyncHandler(createMachine));

// items
router.get("/items", requireAuth, allow, asyncHandler(listItems));
router.post("/items", requireAuth, allow, asyncHandler(createItem));

// prices
router.post("/prices", requireAuth, allow, asyncHandler(createPrice));
router.get("/prices/lookup", requireAuth, allow, asyncHandler(lookupPrices));

export default router;
