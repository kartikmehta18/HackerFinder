
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-github-border bg-github-dark py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-github-text">HackerFind</span>
            </Link>
            <p className="text-github-muted mt-2 text-sm">Find the perfect teammates for your next hackathon</p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h4 className="font-medium text-github-text mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/hackathons" className="text-github-muted hover:text-github-text text-sm">Hackathons</Link></li>
                <li><Link to="/developers" className="text-github-muted hover:text-github-text text-sm">Developers</Link></li>
                <li><Link to="/teams" className="text-github-muted hover:text-github-text text-sm">Teams</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-github-text mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-github-muted hover:text-github-text text-sm">About</Link></li>
                <li><Link to="/faq" className="text-github-muted hover:text-github-text text-sm">FAQ</Link></li>
                <li><Link to="/privacy" className="text-github-muted hover:text-github-text text-sm">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-github-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-github-muted text-sm">© {new Date().getFullYear()} HackerFind. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/kartikmehta18" target="_blank" rel="noopener noreferrer" className="text-github-muted hover:text-github-text">
              <Github size={20} />
            </a>
            <span className="text-github-muted text-sm flex items-center">
              Made with <Heart size={14} className="mx-1 text-github-accent" /> by kartikmehta18
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
