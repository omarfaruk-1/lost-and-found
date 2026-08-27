import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Compass, LogOut, Menu, Plus, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const signOut = async () => {
    await logout();
    navigate("/");
    close();
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark"><Compass size={19} /></span>
          <span>Find<span>Back</span></span>
        </Link>

        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={`nav-links ${open ? "nav-open" : ""}`}>
          <NavLink to="/items" onClick={close}>Browse</NavLink>
          {isAuthenticated && <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>}
          {isAuthenticated && <NavLink to="/my-items" onClick={close}>My posts</NavLink>}
          {isAuthenticated && <NavLink to="/my-claims" onClick={close}>My claims</NavLink>}
          {isAdmin && <NavLink to="/admin" onClick={close}><ShieldCheck size={15}/> Admin</NavLink>}
        </nav>

        <div className={`nav-actions ${open ? "nav-open" : ""}`}>
          {isAuthenticated ? (
            <>
              <Link className="btn btn-primary btn-sm" to="/items/new" onClick={close}>
                <Plus size={16} /> Post item
              </Link>
              <div className="user-menu">
                <Link
                  to="/dashboard"
                  className="navbar-user-name"
                  title={user?.fullName || user?.username}
                  onClick={close}
                >
                  {user?.fullName || user?.username}
                </Link>

                <button
                  className="icon-btn"
                  onClick={signOut}
                  title="Log out"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login" onClick={close}>Log in</Link>
              <Link className="btn btn-primary btn-sm" to="/register" onClick={close}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}