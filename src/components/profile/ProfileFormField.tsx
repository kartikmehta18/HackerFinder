
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface ProfileFormFieldProps {
  form: UseFormReturn<any, any, undefined>;
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  type?: 'text' | 'textarea' | 'url';
}

export const ProfileFormField = ({
  form,
  name,
  label,
  placeholder,
  description,
  type = 'text'
}: ProfileFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea 
                placeholder={placeholder} 
                className="bg-github-dark border-github-border"
                {...field} 
              />
            ) : (
              <Input 
                placeholder={placeholder}
                type={type}
                className="bg-github-dark border-github-border"
                {...field} 
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
