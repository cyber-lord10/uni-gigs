import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { User, Mail, School, DollarSign } from 'lucide-react';

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [myGigs, setMyGigs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;

      try {
        // Fetch My Posted Gigs
        const gigsQuery = query(
          collection(db, 'gigs'),
          where('posterId', '==', currentUser.uid)
        );
        const gigsSnap = await getDocs(gigsQuery);
        const gigsData = gigsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        gigsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setMyGigs(gigsData);

        // Fetch My Applications
        const appsQuery = query(
          collection(db, 'applications'),
          where('applicantId', '==', currentUser.uid)
        );
        const appsSnap = await getDocs(appsQuery);
        
        const appsData = await Promise.all(appsSnap.docs.map(async (appDoc) => {
          const appData = appDoc.data();
          // Fetch gig details for each application
          const gigDoc = await getDoc(doc(db, 'gigs', appData.gigId));
          const gigData = gigDoc.exists() ? gigDoc.data() : { title: 'Unknown Gig' };
          
          return {
            id: appDoc.id,
            ...appData,
            gigTitle: gigData.title,
            gigPayment: gigData.payment
          };
        }));
        
        appsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setMyApplications(appsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="card mb-lg">
        <div className="flex items-center gap-lg">
          <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {currentUser?.displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-xs">{currentUser?.displayName}</h1>
            <div className="flex flex-col gap-xs text-muted text-sm">
              <div className="flex items-center gap-xs">
                <Mail size={16} />
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-xs">
                <School size={16} />
                <span>{currentUser?.university}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-lg">
        <div>
          <h2 className="text-xl font-bold mb-md">My Posted Gigs</h2>
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : myGigs.length === 0 ? (
            <div className="card text-center py-lg">
              <p className="text-muted mb-sm">No gigs posted.</p>
              <Link to="/post-gig" className="btn btn-primary text-sm">Post a Gig</Link>
            </div>
          ) : (
            <div className="grid gap-sm">
              {myGigs.map(gig => (
                <Link key={gig.id} to={`/gigs/${gig.id}`} className="card hover:border-[var(--color-primary)] block p-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold line-clamp-1">{gig.title}</h3>
                    <span className={`text-xs px-sm py-xs rounded ${gig.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {gig.status.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-md">My Applications</h2>
          {loading ? (
            <div className="text-muted">Loading...</div>
          ) : myApplications.length === 0 ? (
            <div className="card text-center py-lg">
              <p className="text-muted">No applications yet.</p>
            </div>
          ) : (
            <div className="grid gap-sm">
              {myApplications.map(app => (
                <Link key={app.id} to={`/gigs/${app.gigId}`} className="card hover:border-[var(--color-primary)] block p-md">
                  <div className="flex justify-between items-start mb-xs">
                    <h3 className="font-semibold line-clamp-1">{app.gigTitle}</h3>
                    <span className={`text-xs px-sm py-xs rounded font-bold ${
                      app.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-muted flex items-center gap-xs">
                    <DollarSign size={14} />
                    {app.gigPayment}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
