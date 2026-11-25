import { Icon } from "../icons";
import { Link } from "../router";

export function BackLink() {
  return (
    <Link to="/courses" className="back-link">
      <Icon name="arrowLeft" size={16} stroke={2} />
      学习
    </Link>
  );
}
