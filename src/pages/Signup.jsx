import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-full max-w-md animate-fade-in">
        <h2 className="text-2xl text-center mb-lg">Create Account</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-sm rounded mb-md text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="label">Full Name</label>
            <input 
              type="text" 
              className="input" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required 
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="label">University Email</label>
            <input 
              type="email" 
              className="input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="student@university.edu"
            />
            <p className="text-xs text-muted mt-1">Must be a valid .edu email address</p>
          </div>
          
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input 
              type="password" 
              className="input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button disabled={loading} className="btn btn-primary w-full mt-sm">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-lg text-sm text-muted">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)] hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
