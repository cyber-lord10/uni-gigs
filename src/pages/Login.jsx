import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { googleProvider, githubProvider, microsoftProvider } from '../lib/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithSocial } = useAuth();
  const navigate = useNavigate();

  async function handleSocialLogin(provider) {
    try {
      setError('');
      setLoading(true);
      await signInWithSocial(provider);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-full max-w-md animate-fade-in">
        <h2 className="text-2xl text-center mb-lg">Welcome Back</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-sm rounded mb-md text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="label">University Email</label>
            <input 
              type="email" 
              className="input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autocomplete
              placeholder="student@university.edu"
            />
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

          <button disabled={loading} className="btn btn-primary w-full mt-sm">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="flex items-center gap-sm my-md">
          <div className="h-px bg-[var(--color-border)] flex-1"></div>
          <span className="text-muted text-sm">OR</span>
          <div className="h-px bg-[var(--color-border)] flex-1"></div>
        </div>

        <div className="flex flex-col gap-sm">
          <button 
            type="button"
            onClick={() => handleSocialLogin(googleProvider)}
            className="btn btn-outline w-full"
          >
            Sign in with Google
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin(githubProvider)}
            className="btn btn-outline w-full"
          >
            Sign in with GitHub
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin(microsoftProvider)}
            className="btn btn-outline w-full"
          >
            Sign in with Microsoft
          </button>
        </div>

        <div className="text-center mt-lg text-sm text-muted">
          Need an account? <Link to="/signup" className="text-[var(--color-primary)] hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
