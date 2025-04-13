
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/context/AuthContext';
// import { useAdmin } from '@/context/AdminContext';
// import { useToast } from '@/hooks/use-toast';
// import { Navbar } from '@/components/layout/Navbar';
// import { Footer } from '@/components/layout/Footer';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Calendar } from 'lucide-react';

// // Define form schema
// const hackathonSchema = z.object({
//   title: z.string().min(3, 'Title must be at least 3 characters'),
//   organizer: z.string().min(2, 'Organizer name is required'),
//   description: z.string().optional(),
//   startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
//     message: 'Invalid start date',
//   }),
//   endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
//     message: 'Invalid end date',
//   }),
//   location: z.string().optional(),
//   isOnline: z.boolean().default(false),
//   url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
//   teamsNeeded: z.boolean().default(false),
//   logo: z.string().url('Must be a valid URL').optional().or(z.literal(''))
// });

// type HackathonFormValues = z.infer<typeof hackathonSchema>;

// const CreateHackathon = () => {
//   const { user } = useAuth();
//   const { isAdmin } = useAdmin();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<HackathonFormValues>({
//     resolver: zodResolver(hackathonSchema),
//     defaultValues: {
//       title: '',
//       organizer: '',
//       description: '',
//       startDate: '',
//       endDate: '',
//       location: '',
//       isOnline: false,
//       url: '',
//       teamsNeeded: false,
//       logo: ''
//     }
//   });

//   const onSubmit = async (values: HackathonFormValues) => {
//     if (!user) {
//       toast({
//         title: 'Authentication required',
//         description: 'You must be logged in to create a hackathon',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       // Auto-approve if admin
//       const isApproved = isAdmin;

//       const { data, error } = await supabase
//         .from('hackathons')
//         .insert({
//           title: values.title,
//           organizer: values.organizer,
//           description: values.description,
//           start_date: new Date(values.startDate).toISOString(),
//           end_date: new Date(values.endDate).toISOString(),
//           location: values.location,
//           is_online: values.isOnline,
//           url: values.url || null,
//           teams_needed: values.teamsNeeded,
//           logo: values.logo || null,
//           created_by: user.id,
//           is_approved: isApproved
//         })
//         .select();

//       if (error) throw error;

//       toast({
//         title: isApproved ? 'Hackathon created!' : 'Hackathon submitted for approval',
//         description: isApproved 
//           ? 'Your hackathon has been successfully created' 
//           : 'Your hackathon will be visible after admin approval',
//       });

//       navigate('/hackathons');
//     } catch (error: any) {
//       toast({
//         title: 'Error creating hackathon',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Redirect if not authenticated
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-github-dark flex flex-col">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center p-6">
//           <div className="bg-github-button border border-github-border p-8 rounded-lg text-center">
//             <h1 className="text-xl font-bold mb-4">Authentication Required</h1>
//             <p className="text-github-muted mb-6">You need to be logged in to access this page.</p>
//             <Button onClick={() => navigate('/auth/login')}>
//               Sign In
//             </Button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-github-dark flex flex-col">
//       <Navbar />
      
//       <div className="flex-1 container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-3xl font-bold mb-2">Create New Hackathon</h1>
          
//           {!isAdmin && (
//             <div className="mb-8 p-4 bg-github-accent/20 border border-github-accent/30 rounded-lg">
//               <p className="text-github-accent">
//                 Your hackathon submission will be reviewed by an admin before being published on the platform.
//               </p>
//             </div>
//           )}
          
//           <div className="bg-github-button border border-github-border rounded-lg p-6">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Hackathon Title */}
//                 <FormField
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Hackathon Title*</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="e.g. Global AI Hackathon 2025" 
//                           className="bg-github-dark border-github-border"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 {/* Organizer */}
//                 <FormField
//                   control={form.control}
//                   name="organizer"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Organizer*</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="e.g. TechCorp" 
//                           className="bg-github-dark border-github-border"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 {/* Description */}
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Textarea 
//                           placeholder="Describe your hackathon..." 
//                           className="bg-github-dark border-github-border min-h-[100px]"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 {/* Date Range */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="startDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Start Date*</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Calendar className="absolute left-3 top-3 h-4 w-4 text-github-muted" />
//                             <Input 
//                               type="date"
//                               className="bg-github-dark border-github-border pl-10"
//                               {...field} 
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
                  
//                   <FormField
//                     control={form.control}
//                     name="endDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>End Date*</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Calendar className="absolute left-3 top-3 h-4 w-4 text-github-muted" />
//                             <Input 
//                               type="date"
//                               className="bg-github-dark border-github-border pl-10"
//                               {...field} 
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
                
//                 {/* Location and Type */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="location"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Location</FormLabel>
//                         <FormControl>
//                           <Input 
//                             placeholder="e.g. San Francisco, CA" 
//                             className="bg-github-dark border-github-border"
//                             {...field} 
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
                  
//                   <FormField
//                     control={form.control}
//                     name="isOnline"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
//                         <FormControl>
//                           <Checkbox
//                             checked={field.value}
//                             onCheckedChange={field.onChange}
//                           />
//                         </FormControl>
//                         <div className="space-y-1 leading-none">
//                           <FormLabel>
//                             This is an online hackathon
//                           </FormLabel>
//                         </div>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
                
//                 {/* URL */}
//                 <FormField
//                   control={form.control}
//                   name="url"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Hackathon Website</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="https://example.com/hackathon" 
//                           className="bg-github-dark border-github-border"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 {/* Logo */}
//                 <FormField
//                   control={form.control}
//                   name="logo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Logo URL</FormLabel>
//                       <FormControl>
//                         <Input 
//                           placeholder="https://example.com/logo.png" 
//                           className="bg-github-dark border-github-border"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Enter a URL to your hackathon logo image (optional)
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 {/* Teams */}
//                 <FormField
//                   control={form.control}
//                   name="teamsNeeded"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                       <FormControl>
//                         <Checkbox
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                         />
//                       </FormControl>
//                       <div className="space-y-1 leading-none">
//                         <FormLabel>
//                           Teams are needed for this hackathon
//                         </FormLabel>
//                         <FormDescription>
//                           Enable this if participants should be actively looking for teams
//                         </FormDescription>
//                       </div>
//                     </FormItem>
//                   )}
//                 />
                
//                 {/* Submit Button */}
//                 <div className="pt-4">
//                   <Button 
//                     type="submit" 
//                     className="bg-github-accent hover:bg-github-accent/80 w-full md:w-auto"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Creating...' : isAdmin ? 'Create Hackathon' : 'Submit for Approval'}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </div>
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// };

// export default CreateHackathon;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';

// Define form schema
const hackathonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  organizer: z.string().min(2, 'Organizer name is required'),
  description: z.string().optional(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
  location: z.string().optional(),
  isOnline: z.boolean().default(false),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  teamsNeeded: z.boolean().default(false),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type HackathonFormValues = z.infer<typeof hackathonSchema>;

const CreateHackathon = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<HackathonFormValues>({
    resolver: zodResolver(hackathonSchema),
    defaultValues: {
      title: '',
      organizer: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      isOnline: false,
      url: '',
      teamsNeeded: false,
      logo: ''
    }
  });

  const onSubmit = async (values: HackathonFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create a hackathon',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hackathons')
        .insert({
          title: values.title,
          organizer: values.organizer,
          description: values.description,
          start_date: new Date(values.startDate).toISOString(),
          end_date: new Date(values.endDate).toISOString(),
          location: values.location,
          is_online: values.isOnline,
          url: values.url || null,
          teams_needed: values.teamsNeeded,
          logo: values.logo || null,
          created_by: user.id
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Hackathon created!',
        description: 'Your hackathon has been successfully created',
      });

      navigate('/hackathons');
    } catch (error: any) {
      toast({
        title: 'Error creating hackathon',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-github-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-github-button border border-github-border p-8 rounded-lg text-center">
            <h1 className="text-xl font-bold mb-4">Authentication Required</h1>
            <p className="text-github-muted mb-6">You need to be logged in to access this page.</p>
            <Button onClick={() => navigate('/auth/login')}>
              Sign In
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Hackathon</h1>
          
          <div className="bg-github-button border border-github-border rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hackathon Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hackathon Title*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Global AI Hackathon 2025" 
                          className="bg-github-dark border-github-border"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Organizer */}
                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizer*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. TechCorp" 
                          className="bg-github-dark border-github-border"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your hackathon..." 
                          className="bg-github-dark border-github-border min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-github-muted" />
                            <Input 
                              type="date"
                              className="bg-github-dark border-github-border pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-github-muted" />
                            <Input 
                              type="date"
                              className="bg-github-dark border-github-border pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Location and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. San Francisco, CA" 
                            className="bg-github-dark border-github-border"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isOnline"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            This is an online hackathon
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* URL */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hackathon Website</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/hackathon" 
                          className="bg-github-dark border-github-border"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Logo */}
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/logo.png" 
                          className="bg-github-dark border-github-border"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL to your hackathon logo image (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Teams */}
                <FormField
                  control={form.control}
                  name="teamsNeeded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Teams are needed for this hackathon
                        </FormLabel>
                        <FormDescription>
                          Enable this if participants should be actively looking for teams
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-github-accent hover:bg-github-accent/80 w-full md:w-auto"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Hackathon'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateHackathon;
