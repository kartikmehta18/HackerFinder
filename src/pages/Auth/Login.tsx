
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { user, signInWithGithub, isLoading } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-github-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Animated orbs */}
      <div className="absolute top-[10%] left-[20%] w-32 h-32 bg-github-accent/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-github-accent/10 rounded-full filter blur-3xl opacity-10 animate-pulse-slow" style={{animationDelay: "1.5s"}}></div>
      
      <div className="m-auto w-full max-w-md p-8 space-y-8 bg-github-button border border-github-border rounded-xl shadow-xl relative z-10 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to HackerFind</h1>
          <p className="mt-2 text-xl text-github-muted">
            Connect with developers and build your perfect hackathon team
          </p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={signInWithGithub}
            disabled={isLoading}
            className="w-full py-6 flex items-center justify-center gap-2 bg-[#2da44e] hover:bg-[#2c974b] text-white border-none shadow-lg transition-all duration-300"
          >
            <Github className="h-5 w-5" />
            <span>{isLoading ? "Connecting..." : "Continue with GitHub"}</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-github-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-github-button text-github-muted">
                No account required
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-github-muted">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
