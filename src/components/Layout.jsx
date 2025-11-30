import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut,
  User,
  Briefcase,
  Bell,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { useNotifications } from "../services/notifications";
import { useState, useRef, useEffect } from "react";

function Notifications() {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications(
    currentUser?.uid,
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted hover:text-[var(--color-text-main)] transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 animate-fade-in">
          <div className="p-md border-b border-[var(--color-border)]">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-lg text-center text-muted text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-md border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors cursor-pointer ${!notif.read ? "bg-[var(--color-primary)]/5" : ""}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <Link to={notif.link || "#"} className="block">
                    <h4 className="text-sm font-semibold mb-xs">
                      {notif.title}
                    </h4>
                    <p className="text-sm text-muted">{notif.message}</p>
                    <span className="text-xs text-muted mt-xs block">
                      {notif.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold text-[var(--color-primary)] flex items-center gap-sm"
          >
            <Briefcase size={24} />
            UniGigs
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-md">
            {currentUser ? (
              <>
                <Link to="/post-gig" className="btn btn-primary text-sm">
                  Post a Gig
                </Link>

                <Link
                  to="/communities"
                  className="text-muted hover:text-[var(--color-primary)] transition-colors"
                  title="Communities"
                >
                  <MessageCircle size={20} />
                </Link>

                <Notifications />

                <Link
                  to="/profile"
                  className="flex items-center gap-sm text-sm text-muted hover:text-[var(--color-primary)] transition-colors"
                >
                  <User size={16} />
                  <span>{currentUser.displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline text-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted hover:text-[var(--color-text-main)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-card)] animate-fade-in">
            <div className="container py-md flex flex-col gap-md">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-sm px-sm py-xs">
                    <User size={16} className="text-[var(--color-primary)]" />
                    <span className="font-semibold">
                      {currentUser.displayName}
                    </span>
                  </div>
                  <Link
                    to="/post-gig"
                    className="btn btn-primary w-full justify-center"
                  >
                    Post a Gig
                  </Link>
                  <Link
                    to="/profile"
                    className="btn btn-outline w-full justify-center"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved-gigs"
                    className="btn btn-outline w-full justify-center"
                  >
                    Saved Gigs
                  </Link>
                  <Link
                    to="/settings"
                    className="btn btn-outline w-full justify-center"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    className="btn btn-outline w-full justify-center"
                  >
                    Help
                  </Link>
                  <div className="flex justify-between items-center px-sm">
                    <span className="text-muted">Notifications</span>
                    <Notifications />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline w-full justify-center text-red-400 border-red-400/20 hover:bg-red-400/10"
                  >
                    <LogOut size={16} className="mr-sm" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline w-full justify-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary w-full justify-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 container py-lg">{children}</main>
    </div>
  );
}
