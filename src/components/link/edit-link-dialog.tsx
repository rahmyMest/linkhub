'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { updateLink } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/constants';
import { TagInput } from './tag-input';
import { useToast } from '@/hooks/use-toast';
import type { Link } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const FormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()),
  image: z.string().url().optional().nullable(),
});

type FormData = z.infer<typeof FormSchema>;

interface EditLinkDialogProps {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditLinkDialog({ link, open, onOpenChange, onSuccess }: EditLinkDialogProps) {
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: link.url,
      title: link.title,
      description: link.description,
      category: link.category,
      tags: link.tags,
      image: link.image,
    },
  });
  
  useEffect(() => {
    if (open) {
      form.reset({
        url: link.url,
        title: link.title,
        description: link.description,
        category: link.category,
        tags: link.tags,
        image: link.image,
      });
    }
  }, [open, link, form]);

  const onSubmit = async (data: FormData) => {
    startSavingTransition(async () => {
      const formData = new FormData();
      formData.append('url', data.url);
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('category', data.category);
      data.tags.forEach(tag => formData.append('tags', tag));
      if (data.image) {
        formData.append('image', data.image);
      }
      
      const result = await updateLink(link.id, {message: ''}, formData);

      if (result.message.includes('Success')) {
        toast({
          title: 'Link Updated!',
          description: 'Your changes have been saved.',
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({
          title: 'Error Saving Link',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Link</DialogTitle>
          <DialogDescription>
            Make changes to your saved link here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[65vh] pr-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="https://example.com" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="Link Title" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                            <Textarea {...field} placeholder="A short description of the link." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <TagInput {...field} />
                            </FormControl>
                            <FormDescription>
                                Press Enter to add a new tag.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </ScrollArea>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="animate-spin" />}
                  Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
