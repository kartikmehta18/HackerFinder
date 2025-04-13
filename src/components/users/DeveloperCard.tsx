
import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Github, MapPin, Calendar } from 'lucide-react';

interface DeveloperCardProps {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location?: string;
  skills: string[];
  available: boolean;
  hackathons?: number;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({
  id,
  name,
  username,
  avatar,
  location,
  skills,
  available,
  hackathons = 0
}) => {
  return (
    <Link to={`/developers/${id}`}>
      <Card className="border border-github-border bg-github-button p-5 h-full card-hover flex flex-col">
        <div className="flex items-start space-x-4">
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            className="w-16 h-16 rounded-full object-cover border border-github-border"
          />
          <div className="flex-1">
            <h3 className="text-github-text font-semibold text-lg">{name}</h3>
            <div className="flex items-center text-github-muted mt-1">
              <Github size={14} className="mr-1" />
              <span className="text-sm">{username}</span>
            </div>
            {location && (
              <div className="flex items-center text-github-muted mt-1">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{location}</span>
              </div>
            )}
            {hackathons > 0 && (
              <div className="flex items-center text-github-muted mt-1">
                <Calendar size={14} className="mr-1" />
                <span className="text-sm">{hackathons} hackathons</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.slice(0, 5).map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="skill-tag">+{skills.length - 5}</span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <span
            className={`h-2 w-2 rounded-full mr-2 ${
              available ? 'bg-github-accent' : 'bg-github-muted'
            }`}
          />
          <span className="text-sm text-github-muted">
            {available ? 'Available for hackathons' : 'Currently busy'}
          </span>
        </div>
      </Card>
    </Link>
  );
};
