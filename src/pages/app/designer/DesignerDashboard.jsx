import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";
import {
  roleActionClass,
  rolePageCardClass,
  roleSubtitleClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";

export default function DesignerDashboard() {
  return (
    <div className="grid gap-5">
      <div className={rolePageCardClass}>
        <div className="max-w-3xl">
          <h2 className={roleTitleClass}>Designer Dashboard</h2>
          <p className={roleSubtitleClass}>
            Accept assigned jobs, move active work cleanly through design, and hand finished items back to CS.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/app/designer/queue" className={roleActionClass("primary")}>
            Queue
          </Link>
          <Link to="/app/designer/in-design" className={roleActionClass("outline")}>
            In Design
          </Link>
          <Link to="/app/designer/completed" className={roleActionClass("outline")}>
            Completed
          </Link>
          <Link to="/app/designer/audit" className={roleActionClass("outline")}>
            Audit
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
