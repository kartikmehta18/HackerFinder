
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface GithubStatsProps {
  username: string;
}

export const GithubStats: React.FC<GithubStatsProps> = ({ username }) => {
  if (!username) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">GitHub Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="relative">
          <img 
            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true&include_all_commits=false&count_private=false`}
            alt="GitHub Stats"
            className="w-full h- rounded-lg"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
            }}
          />
          <Skeleton className="absolute inset-0 -z-10 rounded-lg bg-github-dark" />
        </div>
        
        <div className="relative">
          <img 
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=tokyonight&hide_border=true`}
            alt="Most Used Languages"
            className="w-full rounded-lg"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
            }}
          />
          <Skeleton className="absolute inset-0 -z-10 rounded-lg bg-github-dark" />
        </div>
        
        <div className="relative">
          <img 
            src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=tokyonight&hide_border=true`}
            alt="GitHub Streak"
            className="w-full rounded-lg"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
            }}
          />
          <Skeleton className="absolute inset-0 -z-10 rounded-lg bg-github-dark" />
        </div>
      </div>
    </div>
  );
};
