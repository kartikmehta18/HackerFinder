
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TechStackProps {
  skills: string[];
}

// Map of skill names to skill icon identifiers used by skillicons.dev
const skillIconMap: Record<string, string> = {
  "javascript": "js",
  "js": "js",
  "typescript": "ts",
  "ts": "ts",
  "react": "react",
  "next.js": "nextjs",
  "nextjs": "nextjs",
  "node": "nodejs",
  "nodejs": "nodejs",
  "node.js": "nodejs",
  "express": "express",
  "mongodb": "mongodb",
  "mysql": "mysql",
  "postgres": "postgres",
  "postgresql": "postgres",
  "html": "html",
  "css": "css",
  "tailwind": "tailwind",
  "tailwindcss": "tailwind",
  "bootstrap": "bootstrap",
  "java": "java",
  "python": "py",
  "c": "c",
  "c++": "cpp",
  "cpp": "cpp",
  "git": "git",
  "github": "github",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "aws": "aws",
  "firebase": "firebase",
  "redux": "redux",
  "graphql": "graphql",
  "vue": "vue",
  "angular": "angular",
  "svelte": "svelte",
  "figma": "figma",
  "photoshop": "ps",
  "illustrator": "ai",
  "after effects": "ae",
  "premiere": "pr",
  "xd": "xd",
  "solidity": "solidity",
  "rust": "rust",
  "go": "go",
  "flutter": "flutter",
  "dart": "dart",
  "swift": "swift",
  "kotlin": "kotlin",
  "php": "php",
  "laravel": "laravel",
  "django": "django",
  "flask": "flask",
  "ruby": "ruby",
  "rails": "rails",
  "vite": "vite",
  "webpack": "webpack",
  "vercel": "vercel",
  "netlify": "netlify",
  "azure": "azure",
  "gcp": "gcp",
  "postman": "postman",
  "remix": "remix",
  "appwrite": "appwrite",
  "poligon": "polygon",
  "polygon": "polygon",
  "replit": "replit",
};

export const TechStack: React.FC<TechStackProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  
  // Get the icon identifiers for skills
  const iconIds = skills
    .map(skill => {
      const lowerSkill = skill.toLowerCase().trim();
      return skillIconMap[lowerSkill] || null;
    })
    .filter(Boolean)
    .join(',');
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Languages and Tools</h2>
      
      {iconIds ? (
        <div className="bg-github-dark p-4 rounded-lg border border-github-border relative">
          <img 
            src={`https://skillicons.dev/icons?i=${iconIds}`}
            alt="Tech Stack"
            className="w-full"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
            }}
          />
          <Skeleton className="absolute inset-0 -z-10 rounded-lg bg-github-dark h-full" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span 
              key={i} 
              className="bg-github-dark px-3 py-1 rounded-full text-sm border border-github-border"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
