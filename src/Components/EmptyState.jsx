import { PackageX } from "lucide-react";

export default function EmptyState({ title, icon: Icon = PackageX, description, action }) {
  return (
    <div className="empty-state">
      <Icon size={56} strokeWidth={1.5} className="empty-state-icon" />
      <h3>{title}</h3>
      <p>{description}</p>

      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
