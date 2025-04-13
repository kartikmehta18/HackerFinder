
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get URL hash fragments
        const hash = window.location.hash;
        console.log('Auth callback URL hash:', hash);
        
        // Check for errors in URL
        const queryParams = new URLSearchParams(window.location.search);
        const errorParam = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');
        
        if (errorParam) {
          throw new Error(errorDescription || 'Authentication failed');
        }
        
        // Get session (this will work if we have a valid session from the OAuth flow)
        const { data, error: sessionError } = await supabase.auth.getSession();
        console.log('Auth callback session check:', data?.session?.user?.id);
        
        if (sessionError) throw sessionError;
        
        if (!data.session) {
          // If no session, there might have been an error in the OAuth process
          console.error('No session found during callback');
          setError('Authentication failed. Please try again.');
          setIsProcessing(false);
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        // Successfully authenticated
        toast({
          title: "Successfully signed in",
          description: "Welcome to HackerFind!",
        });
        setIsProcessing(false);
        navigate('/');
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        setError(error.message || 'Authentication failed');
        setIsProcessing(false);
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-github-dark">
      <div className="text-center p-8 bg-github-button border border-github-border rounded-xl max-w-md w-full shadow-lg">
        {error ? (
          <>
            <div className="text-red-500 mb-4 text-xl">⚠️ Authentication Error</div>
            <p className="text-github-muted mb-4">{error}</p>
            <p className="text-github-muted">Redirecting you back to login...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-t-4 border-github-accent animate-spin rounded-full mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-2">{isProcessing ? "Finalizing authentication..." : "Authentication complete!"}</h1>
            <p className="text-github-muted">{isProcessing ? "You will be redirected shortly." : "Redirecting to homepage..."}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
