
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TeamRequestButtonProps {
  targetUserId: string;
  targetUserName: string;
}

export const TeamRequestButton: React.FC<TeamRequestButtonProps> = ({ 
  targetUserId, 
  targetUserName 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if it's the user's own profile
  if (user?.id === targetUserId) return null;
  
  // If not logged in, show login prompt button instead
  if (!user) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => navigate('/auth/login')}
      >
        <Users size={16} />
        <span>Login to Team Up</span>
      </Button>
    );
  }
  
  const sendTeamRequest = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please include a message with your team request.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // First check if a request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from('team_requests')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', targetUserId)
        .maybeSingle();
        
      if (checkError) throw checkError;
        
      if (existingRequest) {
        toast({
          title: "Request already sent",
          description: "You've already sent a team request to this user.",
          variant: "destructive",
        });
        setIsSending(false);
        setIsDialogOpen(false);
        return;
      }
      
      // Insert new team request
      const { error: insertError } = await supabase
        .from('team_requests')
        .insert({
          sender_id: user.id,
          receiver_id: targetUserId,
          message: message,
          status: 'pending'
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Team request sent!",
        description: `Your request has been sent to ${targetUserName}.`,
      });
      
      setIsDialogOpen(false);
      setMessage('');
    } catch (error: any) {
      console.error("Error sending team request:", error);
      toast({
        title: "Error sending request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <Users size={16} />
        <span>Request to Team Up</span>
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-github-button border-github-border">
          <DialogHeader>
            <DialogTitle>Team Up With {targetUserName}</DialogTitle>
            <DialogDescription>
              Send a request to collaborate with this user on hackathons or projects.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to team up..."
              className="resize-none h-32 bg-github-dark border-github-border"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={sendTeamRequest}
              disabled={isSending}
              className="bg-github-accent hover:bg-github-accent/80 flex items-center gap-2"
            >
              <Send size={16} />
              <span>{isSending ? 'Sending...' : 'Send Request'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
