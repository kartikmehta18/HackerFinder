
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GithubStats } from '@/components/profile/GithubStats';
import { TechStack } from '@/components/profile/TechStack';
import { TeamRequestButton } from '@/components/profile/TeamRequestButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Github, Mail, Link as LinkIcon, MapPin, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

const DeveloperProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pastHackathons, setPastHackathons] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        if (!id) return;
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (profileError) throw profileError;
        if (!profileData) throw new Error('User not found');
        
        setProfile(profileData);
        
        // Fetch past hackathons
        const { data: hackathonData, error: hackathonError } = await supabase
          .from('hackathon_participants')
          .select(`
            hackathons (
              id,
              title,
              organizer,
              start_date,
              end_date
            )
          `)
          .eq('user_id', id);
          
        if (hackathonError) throw hackathonError;
        
        // Transform the data
        const pastEvents = hackathonData
          ?.map(entry => entry.hackathons)
          .filter(Boolean)
          .sort((a: any, b: any) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
          
        setPastHackathons(pastEvents || []);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <Skeleton className="w-full aspect-square rounded-xl mb-4" />
                <Skeleton className="w-full h-10 rounded mb-2" />
                <Skeleton className="w-3/4 h-4 rounded mb-4" />
                <Skeleton className="w-full h-32 rounded" />
              </div>
              <div className="md:w-2/3">
                <Skeleton className="w-full h-40 rounded mb-6" />
                <Skeleton className="w-full h-72 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Developer Not Found</h1>
            <p className="text-github-muted mb-6">The profile you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/developers')}>
              Browse Developers
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const skills = Array.isArray(profile.skills) ? profile.skills : 
    (profile.skills ? profile.skills.split(',').map((s: string) => s.trim()) : []);
  
  return (
    <div className="min-h-screen bg-github-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Profile info */}
            <div className="md:w-1/3">
              <div className="bg-github-button border border-github-border rounded-xl p-6 sticky top-24">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-github-accent overflow-hidden mb-4">
                    <img
                      src={profile.avatar_url || 'https://github.com/identicons/jasonlong.png'}
                      alt={profile.full_name || profile.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-center mb-1">
                    {profile.full_name || profile.username || 'Anonymous User'}
                  </h1>
                  
                  {profile.username && (
                    <div className="flex items-center text-github-muted mb-4">
                      <Github size={16} className="mr-1" />
                      <span>{profile.username}</span>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center text-github-muted mb-2">
                      <MapPin size={16} className="mr-1" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 my-4">
                    {skills.slice(0, 8).map((skill: string, index: number) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {skills.length > 8 && (
                      <span className="skill-tag">+{skills.length - 8}</span>
                    )}
                  </div>
                  
                  <div className="w-full flex flex-col gap-2 mt-4">
                    <TeamRequestButton 
                      targetUserId={profile.id} 
                      targetUserName={profile.full_name || profile.username || 'this user'} 
                    />
                    
                    {profile.website && (
                      <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                          <LinkIcon size={16} />
                          <span>Website</span>
                        </a>
                      </Button>
                    )}
                    
                    {user?.id === profile.id && (
                      <Button variant="outline" className="w-full" onClick={() => navigate('/profile/edit')}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Profile content */}
            <div className="md:w-2/3 space-y-8">
              {/* Bio section */}
              {profile.bio && (
                <div className="bg-github-button border border-github-border rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-github-text whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}
              
              {/* Past hackathons */}
              {pastHackathons.length > 0 && (
                <div className="bg-github-button border border-github-border rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Award className="mr-2 text-github-accent" />
                    <h2 className="text-xl font-bold">Hackathon History</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {pastHackathons.map((hackathon: any, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-start p-3 border border-github-border rounded-lg hover:bg-github-dark/30 transition-colors"
                        onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                        role="button"
                      >
                        <Calendar size={20} className="mr-3 text-github-muted" />
                        <div>
                          <h3 className="font-medium">{hackathon.title}</h3>
                          <p className="text-sm text-github-muted">{hackathon.organizer}</p>
                          <p className="text-xs text-github-muted mt-1">
                            {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tech stack */}
              {skills.length > 0 && (
                <div className="bg-github-button border border-github-border rounded-xl p-6">
                  <TechStack skills={skills} />
                </div>
              )}
              
              {/* GitHub stats */}
              {profile.username && (
                <div className="bg-github-button border border-github-border rounded-xl p-6">
                  <GithubStats username={profile.username} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DeveloperProfile;
