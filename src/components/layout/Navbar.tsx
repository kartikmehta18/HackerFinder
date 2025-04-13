
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Github, Menu, PlusCircle, User, LogOut, X, LayoutDashboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, profile, signInWithGithub, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/developers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="border-b border-github-border bg-github-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-github-text">HackerFind</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/hackathons" className="text-github-text hover:text-white">Hackathons</Link>
            <Link to="/developers" className="text-github-text hover:text-white">Developers</Link>
            {user && (
              <Link to={`/profile/${user.id}`} className="text-github-text hover:text-white">Profile</Link>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-github-muted" />
            <Input 
              placeholder="Search developers, hackathons..." 
              className="pl-8 bg-github-button border-github-border text-github-text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Create Hackathon Button (Desktop) */}
              <Button 
                variant="outline" 
                size="sm"
                className="hidden md:flex items-center gap-2 text-github-accent hover:text-github-accent"
                onClick={() => navigate('/admin/hackathons/create')}
              >
                <PlusCircle size={16} />
                <span>Create Hackathon</span>
              </Button>
              
              {/* User Menu (Desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 w-9 h-9">
                    <img
                      src={profile?.avatar_url || 'https://github.com/identicons/jasonlong.png'}
                      alt="User"
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-github-button border-github-border w-56">
                  <DropdownMenuLabel className="text-github-text">
                    {profile?.full_name || profile?.username || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-github-border" />
                  <DropdownMenuItem 
                    className="text-github-text hover:bg-github-hover focus:bg-github-hover cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem
                      className="text-github-text hover:bg-github-hover focus:bg-github-hover cursor-pointer"
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-github-text hover:bg-github-hover focus:bg-github-hover cursor-pointer"
                    onClick={() => navigate('/admin/hackathons/create')}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create Hackathon</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-github-border" />
                  <DropdownMenuItem 
                    className="text-github-text hover:bg-github-hover focus:bg-github-hover cursor-pointer"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button className="github-button hidden md:flex items-center space-x-2" onClick={signInWithGithub}>
              <Github size={18} />
              <span>Sign in with GitHub</span>
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-github-text" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-github-dark border-github-border">
              <SheetHeader>
                <SheetTitle className="text-github-text">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <form onSubmit={handleSearch} className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-github-muted" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-8 bg-github-button border-github-border text-github-text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                <div className="space-y-3">
                  <SheetClose asChild>
                    <Link 
                      to="/hackathons" 
                      className="block p-2 hover:bg-github-button rounded-md text-github-text"
                    >
                      Hackathons
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link 
                      to="/developers" 
                      className="block p-2 hover:bg-github-button rounded-md text-github-text"
                    >
                      Developers
                    </Link>
                  </SheetClose>
                  
                  {user && (
                    <>
                      <SheetClose asChild>
                        <Link 
                          to={`/profile/${user.id}`} 
                          className="block p-2 hover:bg-github-button rounded-md text-github-text"
                        >
                          Profile
                        </Link>
                      </SheetClose>
                      
                      {isAdmin && (
                        <SheetClose asChild>
                          <Link
                            to="/admin/dashboard"
                            className="block p-2 hover:bg-github-button rounded-md text-github-text"
                          >
                            Admin Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      
                      <SheetClose asChild>
                        <Link 
                          to="/admin/hackathons/create" 
                          className="block p-2 hover:bg-github-button rounded-md text-github-text"
                        >
                          Create Hackathon
                        </Link>
                      </SheetClose>
                    </>
                  )}
                  
                  <div className="pt-4 mt-4 border-t border-github-border">
                    {user ? (
                      <SheetClose asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={signOut}
                        >
                          Sign out
                        </Button>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Button 
                          className="github-button w-full flex items-center justify-center gap-2"
                          onClick={signInWithGithub}
                        >
                          <Github size={18} />
                          <span>Sign in with GitHub</span>
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
