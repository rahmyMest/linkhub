'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
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
  DialogTrigger,
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
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { getLinkDetails, addLink } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/constants';
import { TagInput } from './tag-input';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const FormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }).optional(),
  description: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().url().optional().nullable(),
});

type FormData = z.infer<typeof FormSchema>;

type LinkDetailsState = {
  title: string;
  description: string;
  image: string | null;
  category?: Category;
  tags?: string[];
  error?: string;
  url: string;
} | null;

export function AddLinkDialog() {
  const [open, setOpen] = useState(false);
  const [isFetching, startFetchingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [details, setDetails] = useState<LinkDetailsState>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (details) {
      form.setValue('title', details.title);
      form.setValue('description', details.description);
      form.setValue('category', details.category);
      form.setValue('tags', details.tags || []);
      form.setValue('image', details.image);
    }
  }, [details, form]);
  
  const handleFetchDetails = async () => {
    const url = form.getValues('url');
    const result = await form.trigger('url');
    if (!result) return;

    startFetchingTransition(async () => {
      const fetchedDetails = await getLinkDetails(url);
      setDetails({ ...fetchedDetails, url });
      if (fetchedDetails.error) {
        toast({
          title: 'Heads up!',
          description: fetchedDetails.error,
          variant: 'default',
        })
      }
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!details) return;

    startSavingTransition(async () => {
        const formData = new FormData();
        formData.append('url', details.url);
        formData.append('title', data.title || '');
        formData.append('description', data.description || '');
        formData.append('category', data.category || 'Other');
        data.tags?.forEach(tag => formData.append('tags', tag));
        if (data.image) {
            formData.append('image', data.image);
        }
        
        // This is a dummy prevState
        const result = await addLink({message: ''}, formData);

        if (result.message.includes('Success')) {
            toast({
                title: 'Link Saved!',
                description: 'Your link has been successfully saved.',
            });
            handleReset();
        } else {
            toast({
                title: 'Error Saving Link',
                description: result.message,
                variant: 'destructive',
            });
        }
    });
  };
  
  const handleReset = () => {
    form.reset();
    setDetails(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if(!isOpen) handleReset(); else setOpen(true);}}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1" />
          <span>Add Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Add a New Link</DialogTitle>
          <DialogDescription>
            {details
              ? 'AI has pre-filled the details. Review and save.'
              : 'Paste a URL to automatically fetch its details with AI.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[65vh] pr-6">
                <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL</FormLabel>
                        <div className="flex gap-2">
                        <FormControl>
                            <Input {...field} placeholder="https://example.com" disabled={!!details || isFetching} />
                        </FormControl>
                        {!details && (
                            <Button type="button" onClick={handleFetchDetails} disabled={isFetching}>
                            {isFetching ? <Loader2 className="animate-spin" /> : 'Fetch'}
                            </Button>
                        )}
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {isFetching && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                
                {details && (
                    <>
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
                            <FormLabel className="flex items-center gap-2">
                                Category
                                <span className="flex items-center text-xs font-normal bg-purple-100 text-accent-foreground dark:bg-purple-900/50 dark:text-accent rounded-md px-1.5 py-0.5">
                                    <Sparkles className="w-3 h-3 mr-1 text-accent"/> AI Suggested
                                </span>
                            </FormLabel>
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
                           <FormLabel className="flex items-center gap-2">
                                Tags
                                <span className="flex items-center text-xs font-normal bg-purple-100 text-accent-foreground dark:bg-purple-900/50 dark:text-accent rounded-md px-1.5 py-0.5">
                                    <Sparkles className="w-3 h-3 mr-1 text-accent"/> AI Suggested
                                </span>
                            </FormLabel>
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
                    </>
                )}
                </div>
            </ScrollArea>
            {details && (
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={handleReset}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="animate-spin" />}
                  Save Link
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
