import { Link } from "react-router-dom";
export default function NotFound() {
  return <div className="auth-page"><div className="auth-card centered-card"><div className="error-code">404</div><h1>Page not found</h1><p>The page you're looking for doesn't exist.</p><Link className="btn btn-primary" to="/">Go home</Link></div></div>;
}