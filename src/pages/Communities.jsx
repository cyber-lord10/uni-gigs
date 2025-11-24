import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChatService } from '../services/chat';
import { Users, MessageCircle, Plus } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Communities() {
  const { currentUser } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      if (currentUser?.university) {
        try {
          // For demo, ensure at least one community exists
          let comms = await ChatService.getCommunities(currentUser.university);
          
          if (comms.length === 0) {
            await ChatService.createCommunity(
              `${currentUser.university} General`, 
              'General discussion for students.', 
              currentUser.university
            );
            await ChatService.createCommunity(
              'Global Tech Talk', 
              'Discuss technology and coding.', 
              'Global'
            );
            comms = await ChatService.getCommunities(currentUser.university);
          }
          
          setCommunities(comms);
        } catch (error) {
          console.error("Error loading communities:", error);
        }
      }
      setLoading(false);
    }
    fetchCommunities();
  }, [currentUser]);

  return (
    <div className="animate-fade-in">
      <header className="mb-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl mb-xs">Communities</h1>
          <p className="text-muted">Connect with students at {currentUser?.university}</p>
        </div>
      </header>

      {loading ? (
        <div className="grid gap-md">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : communities.length === 0 ? (
        <EmptyState 
          title="No communities found" 
          description="Be the first to start a community!"
          icon={Users}
        />
      ) : (
        <div className="grid gap-md">
          {communities.map(comm => (
            <Link 
              key={comm.id} 
              to={`/communities/${comm.id}`}
              className="card hover:border-[var(--color-primary)] flex items-center gap-lg p-lg transition-all"
            >
              <div className="bg-[var(--color-primary)]/10 p-md rounded-full text-[var(--color-primary)]">
                <Users size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-xs">{comm.name}</h3>
                <p className="text-muted">{comm.description}</p>
              </div>
              <MessageCircle className="text-muted" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
