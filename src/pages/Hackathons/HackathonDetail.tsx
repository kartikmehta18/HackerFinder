
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Globe, Clock, Users, Award, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DeveloperCard } from '@/components/users/DeveloperCard';

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        // Fetch hackathon details
        const { data, error } = await supabase
          .from('hackathons')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setHackathon(data);
          
          // Fetch participants
          const { data: participantData, error: participantError } = await supabase
            .from('hackathon_participants')
            .select(`
              user_id,
              profiles:user_id (*)
            `)
            .eq('hackathon_id', id);
            
          if (participantError) throw participantError;
          
          if (participantData) {
            const profiles = participantData.map(p => p.profiles);
            setParticipants(profiles);
            
            // Check if current user has joined
            if (user) {
              const hasJoined = participantData.some(p => p.user_id === user.id);
              setIsJoined(hasJoined);
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching hackathon details:', error);
        toast({
          title: 'Error loading hackathon',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHackathonDetails();
  }, [id, user, toast]);

  const handleJoinHackathon = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to join a hackathon',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    
    try {
      const { error } = await supabase
        .from('hackathon_participants')
        .insert({
          hackathon_id: id,
          user_id: user.id
        });

      if (error) throw error;

      // Update local state
      setIsJoined(true);
      
      // Update participant count
      const newCount = (hackathon.participants_count || 0) + 1;
      await supabase
        .from('hackathons')
        .update({ participants_count: newCount })
        .eq('id', id);
        
      setHackathon({
        ...hackathon,
        participants_count: newCount
      });

      toast({
        title: 'Joined successfully!',
        description: `You have joined ${hackathon.title}`,
      });
      
      // Refresh participants list
      const { data: refreshedParticipants } = await supabase
        .from('hackathon_participants')
        .select('user_id, profiles:user_id (*)')
        .eq('hackathon_id', id);
        
      if (refreshedParticipants) {
        setParticipants(refreshedParticipants.map(p => p.profiles));
      }
    } catch (error: any) {
      toast({
        title: 'Error joining hackathon',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveHackathon = async () => {
    if (!user) return;
    
    setIsJoining(true);
    
    try {
      const { error } = await supabase
        .from('hackathon_participants')
        .delete()
        .eq('hackathon_id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setIsJoined(false);
      
      // Update participant count
      const newCount = Math.max((hackathon.participants_count || 0) - 1, 0);
      await supabase
        .from('hackathons')
        .update({ participants_count: newCount })
        .eq('id', id);
        
      setHackathon({
        ...hackathon,
        participants_count: newCount
      });
      
      // Remove user from participants list
      setParticipants(participants.filter(p => p.id !== user.id));

      toast({
        title: 'Left hackathon',
        description: `You have left ${hackathon.title}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error leaving hackathon',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-github-accent animate-spin rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hackathon Not Found</h1>
            <p className="text-github-muted mb-6">The hackathon you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/hackathons')}>
              Browse Hackathons
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format dates
  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  const formattedDateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  
  // Calculate duration in days
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-github-dark flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Hackathon Header */}
        <div className="bg-github-button border border-github-border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={hackathon.logo || 'https://picsum.photos/seed/hack/200'}
              alt={hackathon.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{hackathon.title}</h1>
              <p className="text-github-muted mt-1">Organized by {hackathon.organizer}</p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                <div className="flex items-center text-github-muted">
                  <Calendar size={16} className="mr-2" />
                  <span>{formattedDateRange}</span>
                </div>
                
                {hackathon.location && (
                  <div className="flex items-center text-github-muted">
                    <MapPin size={16} className="mr-2" />
                    <span>{hackathon.location}</span>
                  </div>
                )}
                
                {hackathon.is_online && (
                  <div className="flex items-center text-github-accent">
                    <Globe size={16} className="mr-2" />
                    <span>Online Event</span>
                  </div>
                )}
                
                <div className="flex items-center text-github-muted">
                  <Clock size={16} className="mr-2" />
                  <span>{durationDays} day{durationDays !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center text-github-muted">
                  <Users size={16} className="mr-2" />
                  <span>{hackathon.participants_count || 0} participants</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {user ? (
                isJoined ? (
                  <Button 
                    variant="outline" 
                    className="border-github-accent text-github-accent hover:bg-github-accent/10"
                    onClick={handleLeaveHackathon}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Processing...' : 'Leave Hackathon'}
                  </Button>
                ) : (
                  <Button 
                    className="bg-github-accent hover:bg-github-accent/80"
                    onClick={handleJoinHackathon}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Hackathon'}
                  </Button>
                )
              ) : (
                <Button 
                  className="bg-github-accent hover:bg-github-accent/80"
                  onClick={() => navigate('/auth/login')}
                >
                  Sign in to Join
                </Button>
              )}
              
              {hackathon.url && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  asChild
                >
                  <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                    <span>Visit Website</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-github-button border border-github-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About This Hackathon</h2>
              
              {hackathon.description ? (
                <div className="prose prose-invert max-w-none">
                  <p>{hackathon.description}</p>
                </div>
              ) : (
                <p className="text-github-muted">No description provided for this hackathon.</p>
              )}
              
              {hackathon.teams_needed && (
                <div className="mt-6 pt-6 border-t border-github-border">
                  <div className="flex items-center gap-2 text-github-accent">
                    <Award size={20} />
                    <span className="font-medium">Teams are needed for this hackathon!</span>
                  </div>
                  <p className="mt-2 text-github-muted">
                    This hackathon requires or encourages team participation. 
                    Connect with other developers to form a team.
                  </p>
                </div>
              )}
            </div>
            
            {/* Participants */}
            <div className="bg-github-button border border-github-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Participants</h2>
                <span className="bg-github-dark px-3 py-1 rounded-full text-sm">
                  {participants.length} joined
                </span>
              </div>
              
              {participants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participants.map((profile) => (
                    profile && (
                      <DeveloperCard
                        key={profile.id}
                        id={profile.id}
                        name={profile.full_name || profile.username || 'Anonymous User'}
                        username={profile.username || 'user'}
                        avatar={profile.avatar_url || 'https://github.com/identicons/jasonlong.png'}
                        location={profile.location}
                        skills={profile.skills || []}
                        available={true}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto text-github-muted mb-4" />
                  <p className="text-github-muted mb-2">
                    No participants have joined this hackathon yet.
                  </p>
                  {!isJoined && user && (
                    <Button 
                      className="bg-github-accent hover:bg-github-accent/80 mt-2"
                      onClick={handleJoinHackathon}
                      disabled={isJoining}
                    >
                      Be the first to join!
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Quick Info & Actions */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-github-button border border-github-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Quick Info</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-github-muted mb-1">Dates</p>
                  <p className="font-medium">{formattedDateRange}</p>
                </div>
                
                <div>
                  <p className="text-github-muted mb-1">Duration</p>
                  <p className="font-medium">{durationDays} day{durationDays !== 1 ? 's' : ''}</p>
                </div>
                
                <div>
                  <p className="text-github-muted mb-1">Location</p>
                  <p className="font-medium">
                    {hackathon.is_online ? 'Online Event' : (hackathon.location || 'Not specified')}
                  </p>
                </div>
                
                <div>
                  <p className="text-github-muted mb-1">Organizer</p>
                  <p className="font-medium">{hackathon.organizer}</p>
                </div>
                
                <div>
                  <p className="text-github-muted mb-1">Team Formation</p>
                  <p className="font-medium">
                    {hackathon.teams_needed ? 'Teams encouraged/required' : 'Not specified'}
                  </p>
                </div>
              </div>
              
              {user && hackathon.created_by === user.id && (
                <div className="mt-6 pt-6 border-t border-github-border">
                  <h3 className="font-semibold mb-4">Admin Actions</h3>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/admin/hackathons/edit/${id}`)}
                  >
                    Edit Hackathon
                  </Button>
                </div>
              )}
            </div>
            
            {/* Share & Connect */}
            <div className="bg-github-button border border-github-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Share & Connect</h2>
              
              <p className="text-github-muted mb-4">
                Looking for teammates? Share this hackathon with your network.
              </p>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast({
                      title: "Link copied!",
                      description: "Hackathon link copied to clipboard",
                    });
                  }}
                >
                  Copy Link
                </Button>
                
                {hackathon.url && (
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    asChild
                  >
                    <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} />
                      <span>Official Website</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HackathonDetail;
