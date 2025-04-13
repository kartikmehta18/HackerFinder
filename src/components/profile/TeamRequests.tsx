
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define a base request type without profile information
interface BaseTeamRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// Add optional profile information that might come from separate queries
interface TeamRequest extends BaseTeamRequest {
  senderProfile?: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
  receiverProfile?: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
  } | null;
}

export const TeamRequests: React.FC = () => {
  const [incomingRequests, setIncomingRequests] = useState<TeamRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<TeamRequest[]>([]);
  const [teammates, setTeammates] = useState<TeamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'sent' | 'teammates'>('incoming');
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchRequests = async () => {
      setIsLoading(true);
      
      try {
        // Fetch incoming requests
        const { data: incomingData, error: incomingError } = await supabase
          .from('team_requests')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');
          
        if (incomingError) throw incomingError;
        
        // Fetch sent requests
        const { data: sentData, error: sentError } = await supabase
          .from('team_requests')
          .select('*')
          .eq('sender_id', user.id)
          .eq('status', 'pending');
          
        if (sentError) throw sentError;
        
        // Fetch accepted requests (teammates)
        const { data: acceptedData, error: acceptedError } = await supabase
          .from('team_requests')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'accepted');
          
        if (acceptedError) throw acceptedError;
        
        // Also get requests the user sent that were accepted
        const { data: acceptedSentData, error: acceptedSentError } = await supabase
          .from('team_requests')
          .select('*')
          .eq('sender_id', user.id)
          .eq('status', 'accepted');
          
        if (acceptedSentError) throw acceptedSentError;
        
        // Now separately fetch profile data for all users involved
        const userIds = new Set<string>();
        
        // Collect all user IDs that we need to fetch profiles for
        incomingData?.forEach(req => userIds.add(req.sender_id));
        sentData?.forEach(req => userIds.add(req.receiver_id));
        acceptedData?.forEach(req => userIds.add(req.sender_id));
        acceptedSentData?.forEach(req => userIds.add(req.receiver_id));
        
        const userIdsArray = Array.from(userIds);
        
        // Fetch all profiles in a single query
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIdsArray);
          
        if (profilesError) throw profilesError;
        
        // Create a map for quick profile lookup
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
        
        // Enrich team requests with profile data
        const enrichRequests = (requests: any[], isSender: boolean): TeamRequest[] => {
          return requests?.map(req => ({
            ...req,
            senderProfile: isSender ? undefined : profilesMap.get(req.sender_id) || null,
            receiverProfile: isSender ? profilesMap.get(req.receiver_id) || null : undefined
          })) || [];
        };
        
        // Set state with enriched data
        setIncomingRequests(enrichRequests(incomingData || [], false));
        setSentRequests(enrichRequests(sentData || [], true));
        
        // Combine accepted requests
        const allTeammates = [
          ...enrichRequests(acceptedData || [], false),
          ...enrichRequests(acceptedSentData || [], true)
        ];
        setTeammates(allTeammates);
      } catch (error: any) {
        console.error("Error fetching team requests:", error);
        toast({
          title: "Error fetching team requests",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [user, toast]);
  
  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('team_requests')
        .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      // Update the UI
      if (action === 'accept') {
        const acceptedRequest = incomingRequests.find(req => req.id === requestId);
        if (acceptedRequest) {
          setTeammates(prev => [...prev, acceptedRequest]);
        }
      }
      
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: action === 'accept' ? "Request accepted!" : "Request rejected",
        description: action === 'accept' 
          ? "You've added a new teammate!" 
          : "You've rejected the team request.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating request",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Helper function to safely get profile information
  const getProfileName = (request: TeamRequest, isSender: boolean): string => {
    const profile = isSender ? request.receiverProfile : request.senderProfile;
    if (profile) {
      return profile.full_name || profile.username || 'Anonymous User';
    }
    return 'Anonymous User';
  };
  
  // Helper function to safely get profile avatar
  const getProfileAvatar = (request: TeamRequest, isSender: boolean): string | null => {
    return (isSender ? request.receiverProfile?.avatar_url : request.senderProfile?.avatar_url) || null;
  };
  
  // Helper function to get initials for avatar fallback
  const getInitials = (request: TeamRequest, isSender: boolean): string => {
    const profile = isSender ? request.receiverProfile : request.senderProfile;
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  // Helper to get the other user's ID (not the current user)
  const getOtherUserId = (request: TeamRequest): string => {
    if (user?.id === request.sender_id) {
      return request.receiver_id;
    }
    return request.sender_id;
  };
  
  if (!user) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Team Requests</h2>
      
      <div className="flex border-b border-github-border">
        <button
          className={`px-4 py-2 ${activeTab === 'incoming' ? 'border-b-2 border-github-accent font-semibold' : 'text-github-muted'}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming ({incomingRequests.length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'sent' ? 'border-b-2 border-github-accent font-semibold' : 'text-github-muted'}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({sentRequests.length})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'teammates' ? 'border-b-2 border-github-accent font-semibold' : 'text-github-muted'}`}
          onClick={() => setActiveTab('teammates')}
        >
          Teammates ({teammates.length})
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-github-accent animate-spin rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'incoming' && (
            <>
              {incomingRequests.length === 0 ? (
                <p className="text-center py-4 text-github-muted">No incoming team requests.</p>
              ) : (
                incomingRequests.map((request) => (
                  <Card key={request.id} className="bg-github-dark border-github-border">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src={getProfileAvatar(request, false)} />
                        <AvatarFallback>{getInitials(request, false)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{getProfileName(request, false)}</CardTitle>
                        <CardDescription>
                          Sent {new Date(request.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-github-text whitespace-pre-wrap">{request.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleRequestAction(request.id, 'reject')}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-github-accent hover:bg-github-accent/80"
                        onClick={() => handleRequestAction(request.id, 'accept')}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </>
          )}
          
          {activeTab === 'sent' && (
            <>
              {sentRequests.length === 0 ? (
                <p className="text-center py-4 text-github-muted">You haven't sent any team requests.</p>
              ) : (
                sentRequests.map((request) => (
                  <Card key={request.id} className="bg-github-dark border-github-border">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src={getProfileAvatar(request, true)} />
                        <AvatarFallback>{getInitials(request, true)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{getProfileName(request, true)}</CardTitle>
                        <CardDescription>
                          Sent on {new Date(request.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="ml-auto flex items-center text-github-muted">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Pending</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-github-text whitespace-pre-wrap">{request.message}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
          
          {activeTab === 'teammates' && (
            <>
              {teammates.length === 0 ? (
                <p className="text-center py-4 text-github-muted">You don't have any teammates yet.</p>
              ) : (
                teammates.map((teammate) => (
                  <Card key={teammate.id} className="bg-github-dark border-github-border">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src={getProfileAvatar(teammate, teammate.sender_id === user.id)} />
                        <AvatarFallback>{getInitials(teammate, teammate.sender_id === user.id)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{getProfileName(teammate, teammate.sender_id === user.id)}</CardTitle>
                        <CardDescription>
                          Teammates since {new Date(teammate.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="ml-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-github-accent"
                          onClick={() => {
                            window.location.href = `/profile/${getOtherUserId(teammate)}`;
                          }}
                        >
                          <User className="mr-1 h-4 w-4" />
                          View Profile
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
