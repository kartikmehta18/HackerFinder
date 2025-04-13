
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { AuthRequiredMessage } from '@/components/profile/AuthRequiredMessage';
import { profileSchema, ProfileFormValues } from '@/types/profile';

const EditProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define the form with the correct types from the schema
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      username: '',
      bio: '',
      location: '',
      website: '',
      avatar_url: '',
      skills: [] // Initialize with an empty array to match the expected type
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || '',
        skills: profile.skills ? profile.skills.join(', ') : ''  // Join array to string for form display
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to update your profile',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          username: values.username,
          bio: values.bio,
          location: values.location,
          website: values.website,
          avatar_url: values.avatar_url,
          skills: values.skills,  // This is now transformed by zod schema
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated',
      });

      navigate(`/profile/${user.id}`);
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <AuthRequiredMessage />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-github-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>
          
          <div className="bg-github-button border border-github-border rounded-lg p-6">
            <ProfileForm 
              form={form}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/profile/${user.id}`)}
              isSubmitting={form.formState.isSubmitting}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditProfile;
