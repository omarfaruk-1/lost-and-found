import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Compass,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  X,
  MonitorOff,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
    logoutAll,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  const navigate = useNavigate();

  const close = () => {
    setOpen(false);
    setAccountOpen(false);
  };

  const signOut = async () => {
    try {
      await logout();
      navigate("/");
    } finally {
      close();
    }
  };

  const signOutAll = async () => {
    setLogoutAllLoading(true);

    try {
      await logoutAll();
      setLogoutAllOpen(false);
      setAccountOpen(false);
      setOpen(false);
      navigate("/");
    } finally {
      setLogoutAllLoading(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">

          {/* BRAND */}
          <Link
            to="/"
            className="brand"
            onClick={close}
          >
            <span className="brand-mark">
              <Compass size={19} />
            </span>

            <span>
              Find<span>Back</span>
            </span>
          </Link>

          {/* MOBILE MENU */}
          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          {/* NAV LINKS */}
          <nav
            className={`nav-links ${
              open ? "nav-open" : ""
            }`}
          >
            <NavLink
              to="/items"
              onClick={close}
            >
              Browse
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                onClick={close}
              >
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/my-items"
                onClick={close}
              >
                My posts
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/my-claims"
                onClick={close}
              >
                My claims
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={close}
              >
                <ShieldCheck size={15} />
                Admin
              </NavLink>
            )}
          </nav>

          {/* NAV ACTIONS */}
          <div
            className={`nav-actions ${
              open ? "nav-open" : ""
            }`}
          >
            {isAuthenticated ? (
              <>
                <Link
                  className="btn btn-primary btn-sm"
                  to="/items/new"
                  onClick={close}
                >
                  <Plus size={16} />
                  Post item
                </Link>

                {/* ACCOUNT MENU */}
                <div
                  className="user-menu"
                  onMouseEnter={() =>
                    setAccountOpen(true)
                  }
                  onMouseLeave={() =>
                    setAccountOpen(false)
                  }
                >
                  <button
                    type="button"
                    className="navbar-user-name account-trigger"
                    onClick={() =>
                      setAccountOpen(
                        (value) => !value
                      )
                    }
                    aria-expanded={accountOpen}
                  >
                    <span>
                      {user?.fullName ||
                        user?.username}
                    </span>

                    <ChevronDown
                      size={15}
                      className={
                        accountOpen
                          ? "rotate-180"
                          : ""
                      }
                    />
                  </button>

                  {accountOpen && (
                    <div className="account-dropdown">

                      {/* ACCOUNT INFO */}
                      <div className="account-info">
                        <div className="account-avatar">
                          {(
                            user?.fullName ||
                            user?.username ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="account-details">
                          <strong>
                            {user?.fullName ||
                              user?.username}
                          </strong>

                          <span>
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <div className="account-divider" />

                      {/* LOGOUT */}
                      <button
                        type="button"
                        className="account-action"
                        onClick={signOut}
                      >
                        <LogOut size={16} />
                        <span>Log out</span>
                      </button>

                      {/* LOGOUT ALL */}
                      <button
                        type="button"
                        className="account-action danger"
                        onClick={() => {
                          setAccountOpen(false);
                          setLogoutAllOpen(true);
                        }}
                      >
                        <MonitorOff size={16} />
                        <span>
                          Log out all devices
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-ghost btn-sm"
                  to="/login"
                  onClick={close}
                >
                  Log in
                </Link>

                <Link
                  className="btn btn-primary btn-sm"
                  to="/register"
                  onClick={close}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* LOGOUT ALL MODAL */}
      <Modal
        open={logoutAllOpen}
        title="Log out of all devices?"
        onClose={() =>
          !logoutAllLoading &&
          setLogoutAllOpen(false)
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setLogoutAllOpen(false)
              }
              disabled={logoutAllLoading}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={signOutAll}
              loading={logoutAllLoading}
            >
              Log out everywhere
            </Button>
          </>
        }
      >
        <p>
          This will sign you out from all active
          sessions on your account, including this
          device.
        </p>
      </Modal>
    </>
  );
}