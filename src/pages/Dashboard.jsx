import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, MapPin } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGigs() {
      if (!currentUser?.university) return;

      try {
        const q = query(
          collection(db, 'gigs'),
          where('university', '==', currentUser.university),
          where('status', '==', 'open')
        );
        
        const querySnapshot = await getDocs(q);
        const gigsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort client-side to avoid Firestore index requirement
        gigsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        
        setGigs(gigsData);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
      setLoading(false);
    }

    fetchGigs();
  }, [currentUser]);

  return (
    <div className="animate-fade-in">
      <header className="mb-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl mb-xs">Gigs at {currentUser?.university || 'Your University'}</h1>
          <p className="text-muted">Find opportunities or post your own.</p>
        </div>
        <Link to="/post-gig" className="btn btn-primary">
          Post a Gig
        </Link>
      </header>

      {loading ? (
        <div className="grid gap-md">
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div className="flex justify-between items-start mb-sm">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-xs" />
              <Skeleton className="h-4 w-2/3 mb-md" />
              <div className="flex gap-md">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <EmptyState 
          title="No gigs found yet"
          description={`Be the first to post a gig at ${currentUser?.university || 'your university'} and start earning!`}
          actionLabel="Post the first Gig"
          actionLink="/post-gig"
        />
      ) : (
        <div className="grid gap-md">
          {gigs.map(gig => (
            <Link key={gig.id} to={`/gigs/${gig.id}`} className="card hover:border-[var(--color-primary)] block">
              <div className="flex justify-between items-start mb-sm">
                <h3 className="text-lg font-semibold">{gig.title}</h3>
                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-sm py-xs rounded text-sm font-bold flex items-center gap-xs">
                  <DollarSign size={14} />
                  {gig.payment}
                </span>
              </div>
              
              <p className="text-muted mb-md line-clamp-2">{gig.description}</p>
              
              <div className="flex items-center gap-md text-sm text-muted">
                <div className="flex items-center gap-xs">
                  <Clock size={14} />
                  <span>{gig.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-xs">
                  <MapPin size={14} />
                  <span>{gig.university}</span>
                </div>
                <div>
                  Posted by <span className="text-[var(--color-text-main)]">{gig.posterName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
