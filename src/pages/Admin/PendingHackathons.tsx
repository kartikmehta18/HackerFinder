import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PendingHackathonProfile {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

interface PendingHackathon {
  id: string;
  title: string;
  organizer: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_online?: boolean;
  logo?: string;
  description?: string;
  created_by?: string;
  profiles?: PendingHackathonProfile | null;
  is_approved?: boolean;
}

const PendingHackathons = () => {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingHackathons, setPendingHackathons] = useState<PendingHackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState<PendingHackathon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  useEffect(() => {
    const fetchPendingHackathons = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('hackathons')
          .select(`
            *,
            profiles:created_by (
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('is_approved', false)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const formattedData: PendingHackathon[] = data ? data.map((item: any) => ({
          id: item.id,
          title: item.title,
          organizer: item.organizer,
          start_date: item.start_date,
          end_date: item.end_date,
          location: item.location,
          is_online: item.is_online,
          logo: item.logo,
          description: item.description,
          created_by: item.created_by,
          profiles: item.profiles,
          is_approved: item.is_approved
        })) : [];
        
        setPendingHackathons(formattedData);
      } catch (error: any) {
        console.error('Error fetching pending hackathons:', error);
        toast({
          title: 'Error loading pending hackathons',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingHackathons();
    
    const subscription = supabase
      .channel('hackathons-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'hackathons',
        filter: 'is_approved=eq.false'
      }, () => {
        fetchPendingHackathons();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, toast]);
  
  if (!isLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-github-button border border-github-border p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-4">Access Denied</h1>
            <p className="text-github-muted mb-6">You don't have admin permissions to access this page.</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const approveHackathon = async (hackathonId: string) => {
    try {
      const { error } = await supabase
        .from('hackathons')
        .update({
          is_approved: true
        } as any)
        .eq('id', hackathonId);
        
      if (error) throw error;
      
      toast({
        title: 'Hackathon approved',
        description: 'The hackathon is now visible to all users',
      });
      
      setPendingHackathons(prev => prev.filter(h => h.id !== hackathonId));
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error approving hackathon',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const rejectHackathon = async (hackathonId: string) => {
    try {
      const { error } = await supabase
        .from('hackathons')
        .delete()
        .eq('id', hackathonId);
        
      if (error) throw error;
      
      toast({
        title: 'Hackathon rejected',
        description: 'The hackathon request has been removed',
      });
      
      setPendingHackathons(prev => prev.filter(h => h.id !== hackathonId));
      setIsRejectionDialogOpen(false);
      setRejectionReason('');
    } catch (error: any) {
      toast({
        title: 'Error rejecting hackathon',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-github-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pending Hackathon Approvals</h1>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-t-4 border-github-accent animate-spin rounded-full"></div>
          </div>
        ) : pendingHackathons.length === 0 ? (
          <Card className="border-github-border bg-github-button text-center py-12">
            <CardContent>
              <CheckCircle className="h-16 w-16 text-github-accent mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No Pending Approvals</h2>
              <p className="text-github-muted">All hackathon submissions have been reviewed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingHackathons.map(hackathon => (
              <Card key={hackathon.id} className="border-github-border bg-github-button">
                <CardHeader>
                  <div className="flex items-start">
                    {hackathon.logo ? (
                      <img 
                        src={hackathon.logo} 
                        alt={`${hackathon.title} logo`}
                        className="w-12 h-12 rounded-md object-cover mr-4 border border-github-border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-github-dark mr-4 flex items-center justify-center border border-github-border">
                        <Calendar className="h-6 w-6 text-github-accent" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-github-text">{hackathon.title}</CardTitle>
                      <CardDescription>{hackathon.organizer}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-github-muted">
                    <Calendar size={14} className="mr-2" />
                    <span className="text-sm">
                      {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-github-muted">
                    <MapPin size={14} className="mr-2" />
                    <span className="text-sm">
                      {hackathon.is_online ? 'Online' : hackathon.location || 'Location not specified'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-github-muted">
                    <User size={14} className="mr-2" />
                    <span className="text-sm">
                      Submitted by: {hackathon.profiles?.username || hackathon.profiles?.full_name || 'Unknown user'}
                    </span>
                  </div>
                  
                  {hackathon.description && (
                    <p className="text-sm text-github-text mt-2 line-clamp-3">
                      {hackathon.description}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => {
                      setSelectedHackathon(hackathon);
                      setIsRejectionDialogOpen(true);
                    }}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    className="flex-1 bg-github-accent hover:bg-github-accent/80"
                    onClick={() => {
                      setSelectedHackathon(hackathon);
                      setIsDialogOpen(true);
                    }}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-github-button border-github-border">
          <DialogHeader>
            <DialogTitle>Approve Hackathon</DialogTitle>
            <DialogDescription>
              This hackathon will be visible to all users on the platform.
            </DialogDescription>
          </DialogHeader>
          
          {selectedHackathon && (
            <div className="py-4">
              <h3 className="font-medium">{selectedHackathon.title}</h3>
              <p className="text-sm text-github-muted">{selectedHackathon.organizer}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-github-accent hover:bg-github-accent/80"
              onClick={() => selectedHackathon && approveHackathon(selectedHackathon.id)}
            >
              Approve Hackathon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent className="bg-github-button border-github-border">
          <DialogHeader>
            <DialogTitle>Reject Hackathon</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this hackathon request?
            </DialogDescription>
          </DialogHeader>
          
          {selectedHackathon && (
            <div className="py-4">
              <h3 className="font-medium">{selectedHackathon.title}</h3>
              <p className="text-sm text-github-muted">{selectedHackathon.organizer}</p>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Reason for rejection (optional):
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-github-dark border border-github-border rounded-md resize-none h-24"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide feedback to the creator..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedHackathon && rejectHackathon(selectedHackathon.id)}
            >
              Reject Hackathon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PendingHackathons;
