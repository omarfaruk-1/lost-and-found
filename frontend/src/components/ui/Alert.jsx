import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const icons = { error: AlertCircle, success: CheckCircle2, info: Info };

export default function Alert({ type = "error", children }) {
  const Icon = icons[type] || AlertCircle;
  return (
    <div className={`alert alert-${type}`}>
      <Icon size={18} />
      <span>{children}</span>
    </div>
  );
}