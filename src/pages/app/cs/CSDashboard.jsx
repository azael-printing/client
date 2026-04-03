import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";
import {
  roleActionClass,
  rolePageCardClass,
  roleSubtitleClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";

export default function CSDashboard() {
  return (
    <div className="grid gap-5">
      <div className={rolePageCardClass}>
        <div className="max-w-3xl">
          <h2 className={roleTitleClass}>Customer Service Dashboard</h2>
          <p className={roleSubtitleClass}>
            Control the full handoff from quotation to design, production, and delivery.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/app/cs/create-order" className={roleActionClass("primary")}>
            + Create Order
          </Link>
          <Link to="/app/cs/new" className={roleActionClass("outline")}>
            New Requests
          </Link>
          <Link to="/app/cs/design" className={roleActionClass("outline")}>
            In Design
          </Link>
          <Link to="/app/cs/production" className={roleActionClass("outline")}>
            In Production
          </Link>
          <Link to="/app/cs/completed" className={roleActionClass("outline")}>
            Completed
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
