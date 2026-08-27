import { LoaderCircle } from "lucide-react";

export default function Button({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <LoaderCircle size={17} className="spin" />}
      {children}
    </button>
  );
}