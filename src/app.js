// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// // register all app
// import adminRoutes from "./modules/admin/admin.routes.js";
// import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
// import jobsRoutes from "./modules/jobs/jobs.routes.js";
// import notificationsRoutes from "./modules/notifications/notifications.routes.js";
// import historyRoutes from "./modules/history/history.routes.js";
// import authRoutes from "./modules/auth/auth.routes.js";
// import refRoutes from "./modules/ref/ref.routes.js";
// // dotenv.config();
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // force load ../.env (server/.env)
// dotenv.config({ path: path.join(__dirname, "..", ".env") });
// // --- end ---
// const app = express();

// // app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   "https://localhost:5173",
//   "https://localhost:5174",
//   "https://azaelprintingservice.vercel.app/",
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: (origin, cb) => {
//       // allow tools like Postman and same-origin
//       if (!origin) return cb(null, true);
//       if (allowedOrigins.includes(origin)) return cb(null, true);
//       return cb(new Error(`CORS blocked for origin: ${origin}`), false);
//     },
//     credentials: true,
//   }),
// );
// //   end
// app.use(express.json());
// app.use(cookieParser());

// app.get("/health", (req, res) => res.json({ ok: true }));

// app.use("/api/auth", authRoutes);

// // register ruote app
// app.use("/api/admin", adminRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/jobs", jobsRoutes);
// app.use("/api/notifications", notificationsRoutes);
// app.use("/api/history", historyRoutes);
// app.use("/api/ref", refRoutes);
// export default app;

// console.log("Coding is Fun with MuluTila Code Camp!");
// // DEV error printer (shows real reason for 500)
// app.use((err, req, res, next) => {
//   console.error("API ERROR:", err);
//   res.status(err.statusCode || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// register all app
import adminRoutes from "./modules/admin/admin.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import jobsRoutes from "./modules/jobs/jobs.routes.js";
import notificationsRoutes from "./modules/notifications/notifications.routes.js";
import historyRoutes from "./modules/history/history.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import refRoutes from "./modules/ref/ref.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://azclient.vercel.app",
  "https://azaelprintingservice.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/ref", refRoutes);

app.use((err, req, res, next) => {
  console.error("API ERROR:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
