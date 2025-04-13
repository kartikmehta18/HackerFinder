
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Github, 
  Globe, 
  Users, 
  Edit3,
  Clock,
  User,
  Link as LinkIcon,
  Twitter,
  Linkedin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GithubStats } from '@/components/profile/GithubStats';
import { TechStack } from '@/components/profile/TechStack';
import { TeamRequestButton } from '@/components/profile/TeamRequestButton';
import { TeamRequests } from '@/components/profile/TeamRequests';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userHackathons, setUserHackathons] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile(data);
          
          // Fetch additional GitHub info if username exists
          if (data.username && !data.github_followers) {
            try {
              const response = await fetch(`https://api.github.com/users/${data.username}`);
              if (response.ok) {
                const githubData = await response.json();
                
                // Update profile with GitHub data
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({
                    github_followers: githubData.followers || 0,
                    github_following: githubData.following || 0,
                    github_repos: githubData.public_repos || 0,
                    bio: data.bio || githubData.bio,
                    location: data.location || githubData.location,
                    website: data.website || githubData.blog,
                    github_url: githubData.html_url,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', id);
                  
                if (!updateError) {
                  // Update local state with new data
                  setProfile(prev => ({
                    ...prev,
                    github_followers: githubData.followers || 0,
                    github_following: githubData.following || 0,
                    github_repos: githubData.public_repos || 0,
                    bio: prev.bio || githubData.bio,
                    location: prev.location || githubData.location,
                    website: prev.website || githubData.blog,
                    github_url: githubData.html_url
                  }));
                }
              }
            } catch (githubError) {
              console.error('Error fetching GitHub data:', githubError);
            }
          }
          
          // Fetch hackathons this user has joined
          const { data: participantData, error: participantError } = await supabase
            .from('hackathon_participants')
            .select(`
              hackathon_id,
              hackathons (*)
            `)
            .eq('user_id', id);
            
          if (participantError) throw participantError;
          
          if (participantData) {
            const hackathons = participantData.map(p => p.hackathons);
            setUserHackathons(hackathons);
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error loading profile',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProfile();
    }
  }, [id, toast]);

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-github-muted mb-6">The user profile you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/developers')}>
              Browse Developers
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-github-dark flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-github-button border border-github-border rounded-lg p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <img
                  src={profile.avatar_url || 'https://github.com/identicons/jasonlong.png'}
                  alt={profile.full_name || profile.username}
                  className="w-32 h-32 rounded-full border-4 border-github-border object-cover"
                />
                
                <h1 className="text-2xl font-bold mt-4">{profile.full_name || 'Anonymous User'}</h1>
                
                {profile.username && (
                  <p className="text-github-muted text-lg">@{profile.username}</p>
                )}
                
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full flex items-center gap-2"
                    onClick={() => navigate('/profile/edit')}
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </Button>
                )}
                
                {!isOwnProfile && (
                  <div className="mt-4 w-full">
                    <TeamRequestButton 
                      targetUserId={id as string} 
                      targetUserName={profile.full_name || profile.username || 'this user'} 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {profile.bio && (
                  <div>
                    <p className="text-github-text">{profile.bio}</p>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center text-github-muted">
                    <MapPin size={18} className="mr-2" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.github_url && (
                  <div className="flex items-center text-github-muted">
                    <Github size={18} className="mr-2" />
                    <a 
                      href={profile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-github-accent"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center text-github-muted">
                    <Globe size={18} className="mr-2" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-github-accent break-all"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-github-border">
                <h3 className="font-semibold mb-4">GitHub Stats</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-github-dark p-3 rounded-md">
                    <div className="text-xl font-bold">{profile.github_repos || 0}</div>
                    <div className="text-xs text-github-muted">Repos</div>
                  </div>
                  <div className="bg-github-dark p-3 rounded-md">
                    <div className="text-xl font-bold">{profile.github_followers || 0}</div>
                    <div className="text-xs text-github-muted">Followers</div>
                  </div>
                  <div className="bg-github-dark p-3 rounded-md">
                    <div className="text-xl font-bold">{profile.github_following || 0}</div>
                    <div className="text-xs text-github-muted">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6 bg-github-button border border-github-border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                {isOwnProfile && <TabsTrigger value="teams">Team Requests</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                {/* Tech Stack Section */}
                <TechStack skills={profile.skills || []} />
                
                {/* GitHub Stats Section */}
                {profile.username && (
                  <GithubStats username={profile.username} />
                )}
              </TabsContent>
              
              <TabsContent value="hackathons">
                {/* Hackathons Section */}
                <div className="bg-github-button border border-github-border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Hackathons</h2>
                    <span className="bg-github-dark px-3 py-1 rounded-full text-sm">
                      {userHackathons.length} joined
                    </span>
                  </div>
                  
                  {userHackathons.length > 0 ? (
                    <div className="space-y-4">
                      {userHackathons.map((hackathon) => (
                        <Link 
                          key={hackathon.id}
                          to={`/hackathons/${hackathon.id}`}
                          className="block bg-github-dark p-4 rounded-lg border border-github-border hover:border-github-accent transition-colors"
                        >
                          <div className="flex items-center">
                            <img 
                              src={hackathon.logo || 'https://picsum.photos/seed/hack/200'} 
                              alt={hackathon.title}
                              className="w-12 h-12 rounded object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-semibold">{hackathon.title}</h3>
                              <div className="flex items-center text-github-muted text-sm mt-1">
                                <Calendar size={14} className="mr-1" />
                                <span>
                                  {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users size={40} className="mx-auto text-github-muted mb-4" />
                      <p className="text-github-muted mb-2">
                        {isOwnProfile ? "You haven't" : "This user hasn't"} joined any hackathons yet.
                      </p>
                      {isOwnProfile && (
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/hackathons')}
                        >
                          Browse Hackathons
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {isOwnProfile && (
                <TabsContent value="teams">
                  <div className="bg-github-button border border-github-border rounded-lg p-6">
                    <TeamRequests />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
