import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";

// export default function DesignerDashboard() {
//   return (
//     <div className="grid gap-4">
//       <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
//         <h2 className="text-2xl font-extrabold text-primary">
//           Designer Dashboard
//         </h2>
//         <p className="mt-2 text-zinc-700">
//           Open Jobs and move items from Design to Production.
//         </p>

//         <div className="mt-5 flex gap-3 flex-wrap">
//           <Link
//             to="/app/jobs"
//             className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
//           >
//             View Jobs & Update Status
//           </Link>

//           <Link
//             to="/app/designer-assigned"
//             className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
//           >
//             Assigned
//           </Link>

//           <Link
//             to="/app/designer-in-design"
//             className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
//           >
//             In design
//           </Link>
//         </div>
//       </div>

//       <NotificationsPanel />
//     </div>
//   );
// }
// import { Link } from "react-router-dom";
// import NotificationsPanel from "../../../components/app/NotificationsPanel";

export default function DesignerDashboard() {
  return (
    <div className="grid gap-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-primary">
          Designer Dashboard
        </h2>
        <p className="mt-2 text-zinc-700">
          Accept assigned jobs, complete designs, and notify CS.
        </p>

        <div className="mt-5 flex gap-3 flex-wrap">
          <Link
            to="/app/designer-assigned"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-extrabold hover:opacity-90 transition"
          >
            Assigned
          </Link>
          <Link
            to="/app/designer-in-design"
            className="px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-primary font-extrabold hover:bg-bgLight transition"
          >
            In Design
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
