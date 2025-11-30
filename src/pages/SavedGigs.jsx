import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { Bookmark } from "lucide-react";

export default function SavedGigs() {
  // Mock data for now
  const [savedGigs, setSavedGigs] = useState([]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-lg">Saved Gigs</h1>

      {savedGigs.length === 0 ? (
        <EmptyState
          title="No saved gigs"
          description="Gigs you bookmark will appear here."
          icon={Bookmark}
          actionLabel="Browse Gigs"
          actionLink="/"
        />
      ) : (
        <div>{/* List of saved gigs would go here */}</div>
      )}
    </div>
  );
}
