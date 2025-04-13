
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Users, Calendar, Code, Star, GitBranch, ChevronRight, Github, Globe as GlobeIcon, Terminal, ArrowRight, Rocket } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Globe } from '@/components/globe/Globe';
import { DeveloperCard } from '@/components/users/DeveloperCard';
import { HackathonCard } from '@/components/hackathons/HackathonCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user, signInWithGithub } = useAuth();
  const { toast } = useToast();
  const [featuredDevelopers, setFeaturedDevelopers] = useState([]);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch developers
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(3);
          
        if (profilesError) throw profilesError;
        
        // Fetch hackathons
        const { data: hackathonsData, error: hackathonsError } = await supabase
          .from('hackathons')
          .select('*')
          .order('start_date', { ascending: true })
          .limit(3);
          
        if (hackathonsError) throw hackathonsError;
        
        setFeaturedDevelopers(profilesData || []);
        setUpcomingHackathons(hackathonsData || []);
      } catch (error: any) {
        console.error('Error fetching home data:', error);
        toast({
          title: 'Error loading data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-github-dark text-github-text">
      <Navbar />
      
      {/* Hero Section - Enhanced with more dynamic elements */}
      <section className="py-16 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-github-button/30 to-transparent"></div>
        
        {/* Animated pattern background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-8 h-8 bg-github-accent/20 rounded-full animate-pulse"></div>
          <div className="absolute top-[35%] right-[15%] w-12 h-12 bg-github-accent/10 rounded-full animate-pulse" style={{animationDelay: "1s"}}></div>
          <div className="absolute bottom-[25%] left-[20%] w-10 h-10 bg-github-accent/15 rounded-full animate-pulse" style={{animationDelay: "0.5s"}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="inline-block bg-github-accent/20 text-github-accent px-4 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in">
                Find Your Dream Team
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-fade-in" style={{animationDelay: "0.1s"}}>
                Connect with <span className="text-github-accent">talented developers</span> for your next hackathon
              </h1>
              <p className="text-github-muted text-xl mb-8 max-w-xl animate-fade-in" style={{animationDelay: "0.2s"}}>
                Join a community of innovators, collaborate on cutting-edge projects, and showcase your skills at hackathons worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: "0.3s"}}>
                <Button asChild className="bg-github-accent hover:bg-github-accent/90 border-none text-white py-6 px-6 text-lg shadow-lg">
                  <Link to="/developers">
                    Find Teammates
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild className="github-button flex items-center gap-2 py-6 px-6 text-lg">
                  <Link to="/hackathons">
                    Browse Hackathons
                    <Calendar className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              {/* GitHub-like stats with animation */}
              <div className="flex flex-wrap gap-6 mt-12 text-github-muted animate-fade-in" style={{animationDelay: "0.4s"}}>
                <div className="flex items-center gap-2 bg-github-button/50 px-3 py-2 rounded-lg">
                  <Users className="text-github-accent" size={18} />
                  <span>100+ Developers</span>
                </div>
                <div className="flex items-center gap-2 bg-github-button/50 px-3 py-2 rounded-lg">
                  <Calendar className="text-github-accent" size={18} />
                  <span>50+ Hackathons</span>
                </div>
                <div className="flex items-center gap-2 bg-github-button/50 px-3 py-2 rounded-lg">
                  <Github className="text-github-accent" size={18} />
                  <span>GitHub Powered</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="w-full max-w-md relative">
                <div className="absolute inset-0 bg-github-accent/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <Globe />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Modernized with better visual hierarchy */}
      <section className="py-20 bg-github-button/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-github-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How HackerFind Works</h2>
            <p className="text-github-muted text-lg max-w-2xl mx-auto">Find teammates, join hackathons, and build amazing projects together in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-github-button p-8 rounded-xl border border-github-border flex flex-col items-center text-center hover:shadow-lg hover:border-github-accent/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-github-accent/20 flex items-center justify-center mb-6">
                <Search className="h-7 w-7 text-github-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover Hackathons</h3>
              <p className="text-github-muted">Browse upcoming hackathons worldwide, both online and in-person events, filtered by your interests.</p>
            </div>
            
            <div className="bg-github-button p-8 rounded-xl border border-github-border flex flex-col items-center text-center hover:shadow-lg hover:border-github-accent/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-github-accent/20 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-github-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect with Talent</h3>
              <p className="text-github-muted">Browse profiles of skilled developers, designers, and innovators to find the perfect teammates.</p>
            </div>
            
            <div className="bg-github-button p-8 rounded-xl border border-github-border flex flex-col items-center text-center hover:shadow-lg hover:border-github-accent/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-github-accent/20 flex items-center justify-center mb-6">
                <Rocket className="h-7 w-7 text-github-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Build & Win Together</h3>
              <p className="text-github-muted">Collaborate effectively, create innovative projects, and increase your chances of winning.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Developers - Enhanced card layout */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Developers</h2>
              <p className="text-github-muted">Connect with skilled developers ready for their next hackathon</p>
            </div>
            <Button asChild variant="outline" className="text-github-accent border-github-accent hover:bg-github-accent/10 flex items-center gap-1">
              <Link to="/developers">
                View All 
                <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-t-4 border-github-accent animate-spin rounded-full"></div>
            </div>
          ) : featuredDevelopers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDevelopers.map((developer: any) => (
                <DeveloperCard 
                  key={developer.id}
                  id={developer.id}
                  name={developer.full_name || developer.username || 'Anonymous Developer'}
                  username={developer.username || 'user'}
                  avatar={developer.avatar_url || 'https://github.com/identicons/jasonlong.png'}
                  location={developer.location}
                  skills={developer.skills || []}
                  available={true}
                  hackathons={0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-github-button border border-github-border rounded-xl">
              <Terminal className="h-12 w-12 text-github-muted mx-auto mb-4" />
              <p className="text-github-muted text-lg mb-4">No developers have joined yet. Be the first!</p>
              {!user && (
                <Button className="bg-github-accent hover:bg-github-accent/90 text-white" onClick={signInWithGithub}>
                  Sign in with GitHub
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Upcoming Hackathons - Enhanced visual appeal */}
      <section className="py-20 bg-github-button/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Hackathons</h2>
              <p className="text-github-muted">Find your next coding competition and start building</p>
            </div>
            <Button asChild variant="outline" className="text-github-accent border-github-accent hover:bg-github-accent/10 flex items-center gap-1">
              <Link to="/hackathons">
                View All
                <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-t-4 border-github-accent animate-spin rounded-full"></div>
            </div>
          ) : upcomingHackathons.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingHackathons.map((hackathon: any) => (
                <Link to={`/hackathons/${hackathon.id}`} key={hackathon.id}>
                  <HackathonCard 
                    id={hackathon.id}
                    title={hackathon.title}
                    organizer={hackathon.organizer}
                    startDate={hackathon.start_date}
                    endDate={hackathon.end_date}
                    location={hackathon.location || ''}
                    isOnline={hackathon.is_online}
                    logo={hackathon.logo}
                    url={hackathon.url}
                    participantsCount={hackathon.participants_count}
                    teamsNeeded={hackathon.teams_needed}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-github-button border border-github-border rounded-xl">
              <Calendar className="h-12 w-12 text-github-muted mx-auto mb-4" />
              <p className="text-github-muted text-lg mb-4">No hackathons have been created yet.</p>
              {user && (
                <Link to="/admin/hackathons/create">
                  <Button className="bg-github-accent hover:bg-github-accent/90 text-white">Create a Hackathon</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section - More visually compelling */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-github-button/80 to-github-button border border-github-border rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.3) 2%, transparent 0%)`,
              backgroundSize: '100px 100px'
            }}></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-github-accent to-transparent opacity-60"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to find your dream team?</h2>
            <p className="text-github-muted text-xl mb-10 max-w-2xl mx-auto relative z-10">
              Join HackerFind today to discover talented developers, exciting hackathons, and start building your next award-winning project.
            </p>
            {user ? (
              <Button 
                asChild
                className="bg-github-accent hover:bg-github-accent/90 text-white border-none px-8 py-6 text-xl relative z-10 rounded-xl"
              >
                <Link to="/hackathons">Browse Hackathons</Link>
              </Button>
            ) : (
              <Button 
                className="bg-github-accent hover:bg-github-accent/90 text-white border-none px-8 py-6 text-xl relative z-10 rounded-xl flex items-center gap-2"
                onClick={signInWithGithub}
              >
                <Github className="h-5 w-5" />
                Sign Up with GitHub
              </Button>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
