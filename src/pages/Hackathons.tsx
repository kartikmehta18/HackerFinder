
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HackathonCard } from '@/components/hackathons/HackathonCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, PlusCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Hackathons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState('');
  const [onlyTeamsNeeded, setOnlyTeamsNeeded] = useState(false);
  const [eventType, setEventType] = useState('all'); // 'all', 'online', 'in-person'
  
  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('hackathons')
          .select('*')
          .order('start_date', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setHackathons(data);
          
          // Extract locations and organizers for filters
          const locationSet = new Set<string>();
          const organizerSet = new Set<string>();
          
          data.forEach(hackathon => {
            if (hackathon.location) locationSet.add(hackathon.location);
            if (hackathon.organizer) organizerSet.add(hackathon.organizer);
          });
          
          setLocations(Array.from(locationSet));
          setOrganizers(Array.from(organizerSet));
        }
      } catch (error: any) {
        console.error('Error fetching hackathons:', error);
        toast({
          title: 'Error loading hackathons',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHackathons();
  }, [toast]);
  
  const filteredHackathons = hackathons.filter(hackathon => {
    // Filter by search query
    const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hackathon.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by location
    const matchesLocation = !selectedLocation || hackathon.location === selectedLocation;
    
    // Filter by organizer
    const matchesOrganizer = !selectedOrganizer || hackathon.organizer === selectedOrganizer;
    
    // Filter by teams needed
    const matchesTeamsNeeded = !onlyTeamsNeeded || hackathon.teams_needed;
    
    // Filter by event type
    const matchesEventType = 
      eventType === 'all' || 
      (eventType === 'online' && hackathon.is_online) ||
      (eventType === 'in-person' && !hackathon.is_online);
    
    return matchesSearch && matchesLocation && matchesOrganizer && matchesTeamsNeeded && matchesEventType;
  });
  
  const clearFilters = () => {
    setSelectedLocation('');
    setSelectedOrganizer('');
    setOnlyTeamsNeeded(false);
    setEventType('all');
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL search params
    setSearchParams({ search: searchQuery });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-github-dark">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Find Hackathons</h1>
          
          {user && (
            <Button 
              className="bg-github-accent hover:bg-github-accent/80 flex items-center gap-2"
              onClick={() => navigate('/admin/hackathons/create')}
            >
              <PlusCircle size={16} />
              <span>Create Hackathon</span>
            </Button>
          )}
        </div>
        
        {/* Tabs for event type */}
        <Tabs defaultValue="all" value={eventType} onValueChange={setEventType} className="mb-6">
          <TabsList className="bg-github-button border border-github-border">
            <TabsTrigger value="all" className="data-[state=active]:bg-github-accent data-[state=active]:text-white">
              All Events
            </TabsTrigger>
            <TabsTrigger value="online" className="data-[state=active]:bg-github-accent data-[state=active]:text-white">
              Online Only
            </TabsTrigger>
            <TabsTrigger value="in-person" className="data-[state=active]:bg-github-accent data-[state=active]:text-white">
              In-Person
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-github-muted" />
              <Input
                placeholder="Search hackathons..."
                className="pl-10 bg-github-button border-github-border text-github-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Button 
              variant="outline" 
              className="github-button flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              <span>Filters</span>
              {(selectedLocation || selectedOrganizer || onlyTeamsNeeded) && (
                <span className="ml-1 bg-github-accent text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {(selectedLocation ? 1 : 0) + (selectedOrganizer ? 1 : 0) + (onlyTeamsNeeded ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>
          
          {showFilters && (
            <Card className="border border-github-border bg-github-button mt-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-github-muted hover:text-github-text"
                    onClick={clearFilters}
                  >
                    Clear all
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Location filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="bg-github-button border-github-border text-github-text">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent className="bg-github-button border-github-border text-github-text">
                        <SelectItem value="">Any location</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Organizer filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Organizer</label>
                    <Select value={selectedOrganizer} onValueChange={setSelectedOrganizer}>
                      <SelectTrigger className="bg-github-button border-github-border text-github-text">
                        <SelectValue placeholder="Any organizer" />
                      </SelectTrigger>
                      <SelectContent className="bg-github-button border-github-border text-github-text">
                        <SelectItem value="">Any organizer</SelectItem>
                        {organizers.map(organizer => (
                          <SelectItem key={organizer} value={organizer}>
                            {organizer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Teams Needed filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Team Status</label>
                    <div className="flex items-center mt-2">
                      <Checkbox 
                        id="teamsNeeded"
                        checked={onlyTeamsNeeded}
                        onCheckedChange={(checked) => setOnlyTeamsNeeded(!!checked)}
                        className="border-github-border"
                      />
                      <label 
                        htmlFor="teamsNeeded"
                        className="ml-2 text-sm cursor-pointer"
                      >
                        Only show hackathons needing teams
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Applied filters */}
                {(selectedLocation || selectedOrganizer || onlyTeamsNeeded || eventType !== 'all') && (
                  <div className="mt-4 pt-4 border-t border-github-border">
                    <div className="text-sm font-medium mb-2">Applied Filters:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation && (
                        <div className="bg-github-accent/20 text-github-accent px-2 py-1 rounded-full text-xs flex items-center">
                          Location: {selectedLocation}
                          <button 
                            onClick={() => setSelectedLocation('')}
                            className="ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      
                      {selectedOrganizer && (
                        <div className="bg-github-accent/20 text-github-accent px-2 py-1 rounded-full text-xs flex items-center">
                          Organizer: {selectedOrganizer}
                          <button 
                            onClick={() => setSelectedOrganizer('')}
                            className="ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      
                      {onlyTeamsNeeded && (
                        <div className="bg-github-accent/20 text-github-accent px-2 py-1 rounded-full text-xs flex items-center">
                          Teams needed
                          <button 
                            onClick={() => setOnlyTeamsNeeded(false)}
                            className="ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      
                      {eventType !== 'all' && (
                        <div className="bg-github-accent/20 text-github-accent px-2 py-1 rounded-full text-xs flex items-center">
                          {eventType === 'online' ? 'Online only' : 'In-person only'}
                          <button 
                            onClick={() => setEventType('all')}
                            className="ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-t-4 border-github-accent animate-spin rounded-full"></div>
          </div>
        ) : filteredHackathons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map(hackathon => (
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
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No hackathons found</h3>
            <p className="text-github-muted mb-6">Try adjusting your filters or search term</p>
            {user && (
              <Button 
                className="bg-github-accent hover:bg-github-accent/80 flex items-center gap-2"
                onClick={() => navigate('/admin/hackathons/create')}
              >
                <PlusCircle size={16} />
                <span>Create a Hackathon</span>
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Hackathons;
