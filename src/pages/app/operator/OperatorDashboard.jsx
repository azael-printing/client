import { Link } from "react-router-dom";
import NotificationsPanel from "../../../components/app/NotificationsPanel";
import {
  roleActionClass,
  rolePageCardClass,
  roleSubtitleClass,
  roleTitleClass,
} from "../../../components/common/rolePageUi";

export default function OperatorDashboard() {
  return (
    <div className="grid gap-5">
      <div className={rolePageCardClass}>
        <div className="max-w-3xl">
          <h2 className={roleTitleClass}>Operator Dashboard</h2>
          <p className={roleSubtitleClass}>
            Handle only approved production work, keep progress updates tight, and push completed jobs back to CS fast.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/app/operator/queue" className={roleActionClass("primary")}>
            Queue
          </Link>
          <Link to="/app/operator/in-production" className={roleActionClass("outline")}>
            In Production
          </Link>
          <Link to="/app/operator/completed" className={roleActionClass("outline")}>
            Completed
          </Link>
          <Link to="/app/operator/audit" className={roleActionClass("outline")}>
            Audit
          </Link>
        </div>
      </div>

      <NotificationsPanel />
    </div>
  );
}
