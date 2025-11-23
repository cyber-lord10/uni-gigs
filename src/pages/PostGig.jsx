import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

export default function PostGig() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    payment: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'gigs'), {
        title: formData.title,
        description: formData.description,
        payment: Number(formData.payment),
        posterId: currentUser.uid,
        posterName: currentUser.displayName,
        university: currentUser.university,
        status: 'open',
        createdAt: serverTimestamp()
      });
      navigate('/');
    } catch (err) {
      setError('Failed to post gig: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl mb-lg">Post a New Gig</h1>

      <div className="card">
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-sm rounded mb-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="label">Gig Title</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Help moving out of dorm"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[150px] resize-y"
              placeholder="Describe what needs to be done..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="label">Payment Amount ($)</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="number"
                className="input pl-8"
                placeholder="20"
                min="0"
                value={formData.payment}
                onChange={e => setFormData({...formData, payment: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-sm mt-md">
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Posting...' : 'Post Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
