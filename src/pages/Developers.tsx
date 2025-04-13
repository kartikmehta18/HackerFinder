
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DeveloperCard } from '@/components/users/DeveloperCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Developers = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [developers, setDevelopers] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  
  useEffect(() => {
    const fetchDevelopers = async () => {
      setIsLoading(true);
      try {
        // Fetch profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          setDevelopers(data);
          
          // Extract locations and skills for filters
          const locationSet = new Set<string>();
          const skillSet = new Set<string>();
          
          data.forEach(developer => {
            if (developer.location) locationSet.add(developer.location);
            if (developer.skills && Array.isArray(developer.skills)) {
              developer.skills.forEach((skill: string) => {
                skillSet.add(skill);
              });
            }
          });
          
          setLocations(Array.from(locationSet));
          setSkills(Array.from(skillSet));
        }
      } catch (error: any) {
        console.error('Error fetching developers:', error);
        toast({
          title: 'Error loading developers',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDevelopers();
  }, [toast]);
  
  const filteredDevelopers = developers.filter(developer => {
    // Filter by search query (name, username, or bio)
    const matchesSearch = (
      (developer.full_name && developer.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (developer.username && developer.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (developer.bio && developer.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Filter by location
    const matchesLocation = !selectedLocation || developer.location === selectedLocation;
    
    // Filter by skill
    const matchesSkill = !selectedSkill || 
      (developer.skills && Array.isArray(developer.skills) && developer.skills.includes(selectedSkill));
    
    return matchesSearch && matchesLocation && matchesSkill;
  });
  
  const clearFilters = () => {
    setSelectedLocation('');
    setSelectedSkill('');
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
        <h1 className="text-3xl font-bold mb-8">Find Developers</h1>
        
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-github-muted" />
              <Input
                placeholder="Search developers by name, username, or bio..."
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
              {(selectedLocation || selectedSkill) && (
                <span className="ml-1 bg-github-accent text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {(selectedLocation ? 1 : 0) + (selectedSkill ? 1 : 0)}
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
                
                <div className="grid md:grid-cols-2 gap-6">
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
                  
                  {/* Skill filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skill</label>
                    <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                      <SelectTrigger className="bg-github-button border-github-border text-github-text">
                        <SelectValue placeholder="Any skill" />
                      </SelectTrigger>
                      <SelectContent className="bg-github-button border-github-border text-github-text">
                        <SelectItem value="">Any skill</SelectItem>
                        {skills.map(skill => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Applied filters */}
                {(selectedLocation || selectedSkill) && (
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
                      
                      {selectedSkill && (
                        <div className="bg-github-accent/20 text-github-accent px-2 py-1 rounded-full text-xs flex items-center">
                          Skill: {selectedSkill}
                          <button 
                            onClick={() => setSelectedSkill('')}
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
        ) : filteredDevelopers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevelopers.map(developer => (
              developer && (
                <DeveloperCard
                  key={developer.id}
                  id={developer.id}
                  name={developer.full_name || developer.username || 'Anonymous User'}
                  username={developer.username || 'user'}
                  avatar={developer.avatar_url || 'https://github.com/identicons/jasonlong.png'}
                  location={developer.location}
                  skills={developer.skills || []}
                  available={true}
                  hackathons={0}
                />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No developers found</h3>
            <p className="text-github-muted">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Developers;
