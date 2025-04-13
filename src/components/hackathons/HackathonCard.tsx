
import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HackathonCardProps {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  logo: string;
  url?: string;
  participantsCount: number;
  teamsNeeded: boolean;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  id,
  title,
  organizer,
  startDate,
  endDate,
  location,
  isOnline,
  logo,
  url,
  participantsCount,
  teamsNeeded
}) => {
  const formattedDateRange = new Date(startDate).toLocaleDateString() + ' - ' + new Date(endDate).toLocaleDateString();
  
  return (
    <Card className="border border-github-border bg-github-button p-5 h-full card-hover">
      <div className="flex items-start space-x-4">
        <img
          src={logo}
          alt={`${title} logo`}
          className="w-16 h-16 rounded-md object-cover border border-github-border"
        />
        <div className="flex-1">
          <h3 className="text-github-text font-semibold text-lg">{title}</h3>
          <p className="text-github-muted text-sm">{organizer}</p>
        </div>
        
        {teamsNeeded && (
          <div className="bg-github-accent/20 text-github-accent text-xs px-2 py-1 rounded-full">
            Teams Needed
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-github-muted">
          <Calendar size={14} className="mr-2" />
          <span className="text-sm">{formattedDateRange}</span>
        </div>
        
        <div className="flex items-center text-github-muted">
          <MapPin size={14} className="mr-2" />
          <span className="text-sm">{isOnline ? 'Online' : location}</span>
        </div>
        
        <div className="flex items-center text-github-muted">
          <Users size={14} className="mr-2" />
          <span className="text-sm">{participantsCount} participants</span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button asChild className="flex-1 github-button">
          <Link to={`/hackathons/${id}`}>View Details</Link>
        </Button>
        
        {url && (
          <Button asChild variant="outline" className="github-button">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} />
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
};
