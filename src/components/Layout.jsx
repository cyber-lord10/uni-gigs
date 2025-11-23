import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Briefcase } from 'lucide-react';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[var(--color-primary)] flex items-center gap-sm">
            <Briefcase size={24} />
            UniGigs
          </Link>

          <div className="flex items-center gap-md">
            {currentUser ? (
              <>
                <Link to="/post-gig" className="btn btn-primary text-sm">
                  Post a Gig
                </Link>
                <div className="flex items-center gap-sm text-sm text-muted">
                  <User size={16} />
                  <span>{currentUser.displayName}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline text-sm">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline text-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-lg">
        {children}
      </main>
    </div>
  );
}
