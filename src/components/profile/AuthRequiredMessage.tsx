
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AuthRequiredMessage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-github-button border border-github-border p-8 rounded-lg text-center">
      <h1 className="text-xl font-bold mb-4">Authentication Required</h1>
      <p className="text-github-muted mb-6">You need to be logged in to access this page.</p>
      <Button onClick={() => navigate('/auth/login')}>
        Sign In
      </Button>
    </div>
  );
};
