import { http } from "./http";

// export async function listMyNotifications() {
//   const res = await http.get("/api/notifications/me");
//   return res.data.items;
// }

// export async function markNotificationSeen(id) {
//   const res = await http.post(`/api/notifications/${id}/seen`);
//   return res.data;
// }
// import { http } from "./http";

export async function myNotifications() {
  const res = await http.get("/api/notifications/me");
  return res.data.notifications;
}

export async function markNotificationRead(id) {
  const res = await http.post(`/api/notifications/${id}/read`);
  return res.data.notification;
}
