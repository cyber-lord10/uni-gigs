import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ 
  title = "No data found", 
  description = "There is nothing here yet.", 
  actionLabel, 
  actionLink,
  icon: Icon = FolderOpen
}) {
  return (
    <div className="card text-center py-xl flex flex-col items-center animate-fade-in">
      <div className="bg-[var(--color-bg)] p-lg rounded-full mb-md text-[var(--color-text-muted)]">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl mb-xs">{title}</h3>
      <p className="text-muted mb-lg max-w-md">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
