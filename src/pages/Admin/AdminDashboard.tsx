
import React from 'react';
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ClipboardList, Users, Calendar, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard = () => {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      try {
        // Get pending hackathons count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('hackathons')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', false);
          
        if (pendingError) throw pendingError;
        
        // Get total users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Get total approved hackathons count
        const { count: hackathonsCount, error: hackathonsError } = await supabase
          .from('hackathons')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', true);
          
        if (hackathonsError) throw hackathonsError;
        
        // Get total team requests count
        const { count: teamRequestsCount, error: teamRequestsError } = await supabase
          .from('team_requests')
          .select('*', { count: 'exact', head: true });
          
        if (teamRequestsError) throw teamRequestsError;
        
        return {
          pendingHackathons: pendingCount || 0,
          totalUsers: usersCount || 0,
          totalHackathons: hackathonsCount || 0,
          totalTeamRequests: teamRequestsCount || 0,
        };
      } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        toast({
          title: 'Error loading dashboard',
          description: error.message,
          variant: 'destructive',
        });
        return {
          pendingHackathons: 0,
          totalUsers: 0,
          totalHackathons: 0,
          totalTeamRequests: 0,
        };
      }
    },
    enabled: !!user && isAdmin,
  });
  
  // Redirect if not admin
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
  
  return (
    <div className="min-h-screen bg-github-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-t-4 border-github-accent animate-spin rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-github-border bg-github-button relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-24 bg-github-accent/10 flex items-center justify-center">
                  <ClipboardList className="h-12 w-12 text-github-accent opacity-70" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-github-muted font-normal">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.pendingHackathons || 0}</div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-github-accent p-0 h-auto hover:bg-transparent hover:text-github-accent/80"
                    onClick={() => navigate('/admin/pending-hackathons')}
                  >
                    View Requests
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-github-border bg-github-button relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-24 bg-github-accent/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-github-accent opacity-70" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-github-muted font-normal">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-github-accent p-0 h-auto hover:bg-transparent hover:text-github-accent/80"
                    onClick={() => navigate('/developers')}
                  >
                    View Users
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-github-border bg-github-button relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-24 bg-github-accent/10 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-github-accent opacity-70" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-github-muted font-normal">Approved Hackathons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalHackathons || 0}</div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-github-accent p-0 h-auto hover:bg-transparent hover:text-github-accent/80"
                    onClick={() => navigate('/hackathons')}
                  >
                    View Hackathons
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-github-border bg-github-button relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-24 bg-github-accent/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-github-accent opacity-70" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-github-muted font-normal">Team Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalTeamRequests || 0}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Admin Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-github-border bg-github-button">
                <CardHeader>
                  <CardTitle>Pending Hackathons</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-github-muted">
                    Review and approve hackathon submissions from users
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-github-accent hover:bg-github-accent/80"
                    onClick={() => navigate('/admin/pending-hackathons')}
                  >
                    Manage Approvals
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-github-border bg-github-button">
                <CardHeader>
                  <CardTitle>Create New Hackathon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-github-muted">
                    Add a new hackathon event directly to the platform
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-github-accent hover:bg-github-accent/80"
                    onClick={() => navigate('/admin/hackathons/create')}
                  >
                    Create Hackathon
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-github-border bg-github-button">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-github-muted">
                    View and manage user accounts and permissions
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-github-accent hover:bg-github-accent/80"
                    onClick={() => navigate('/developers')}
                  >
                    View Users
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
