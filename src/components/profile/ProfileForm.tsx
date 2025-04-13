
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormField } from './ProfileFormField';
import { ProfileFormValues } from '@/types/profile';

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues, any, undefined>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ProfileForm = ({ form, onSubmit, onCancel, isSubmitting }: ProfileFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileFormField
          form={form}
          name="full_name"
          label="Full Name"
          placeholder="Your full name"
        />
        
        <ProfileFormField
          form={form}
          name="username"
          label="Username"
          placeholder="Your username"
        />
        
        <ProfileFormField
          form={form}
          name="bio"
          label="Bio"
          placeholder="A short bio about yourself"
          description="Brief description that will appear on your profile (max 160 characters)"
          type="textarea"
        />
        
        <ProfileFormField
          form={form}
          name="location"
          label="Location"
          placeholder="e.g. San Francisco, CA"
        />
        
        <ProfileFormField
          form={form}
          name="website"
          label="Website"
          placeholder="https://yourwebsite.com"
          type="url"
        />
        
        <ProfileFormField
          form={form}
          name="avatar_url"
          label="Avatar URL"
          placeholder="https://example.com/avatar.png"
          description="Link to your profile picture"
          type="url"
        />
        
        <ProfileFormField
          form={form}
          name="skills"
          label="Skills"
          placeholder="React, TypeScript, Node.js, UI/UX"
          description="Comma-separated list of your skills"
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-github-accent hover:bg-github-accent/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
