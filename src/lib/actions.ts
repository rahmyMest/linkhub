'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db, addLink as dbAddLink, updateLink as dbUpdateLink, deleteLink as dbDeleteLink } from './data';
import type { Link, Category } from './types';
import { categorizeLink } from '@/ai/flows/categorize-link';
import { CATEGORIES } from './constants';

// Schema for adding a new link
const LinkSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()),
  image: z.string().url().optional().nullable(),
});

export type FormState = {
  message: string;
  errors?: {
    url?: string[];
    title?: string[];
    description?: string[];
    category?: string[];
    tags?: string[];
  };
};

export async function addLink(prevState: FormState, formData: FormData) {
  const validatedFields = LinkSchema.safeParse({
    url: formData.get('url'),
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    tags: formData.getAll('tags'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to add link. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const newLink: Omit<Link, 'id' | 'createdAt'> = {
      ...validatedFields.data,
      description: validatedFields.data.description || '',
      image: validatedFields.data.image || null,
    };
    await dbAddLink(newLink);
  } catch (error) {
    return { message: 'Database Error: Failed to add link.' };
  }

  revalidatePath('/');
  return { message: 'Successfully added link.' };
}

export async function updateLink(id: string, prevState: FormState, formData: FormData) {
  const validatedFields = LinkSchema.safeParse({
    url: formData.get('url'),
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    tags: formData.getAll('tags'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to update link. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const updatedLink: Partial<Link> = {
      ...validatedFields.data,
      description: validatedFields.data.description || '',
      image: validatedFields.data.image || null,
    };
    await dbUpdateLink(id, updatedLink);
  } catch (error) {
    return { message: 'Database Error: Failed to update link.' };
  }

  revalidatePath('/');
  return { message: 'Successfully updated link.' };
}

export async function deleteLink(id: string) {
  try {
    await dbDeleteLink(id);
    revalidatePath('/');
    return { message: 'Deleted Link.' };
  } catch (error) {
    return { message: 'Database Error: Failed to delete link.' };
  }
}

// Action to get link metadata and AI suggestions
const GetLinkDetailsSchema = z.object({
  url: z.string().url(),
});

type LinkDetails = {
    title: string;
    description: string;
    image: string | null;
    category?: Category;
    tags?: string[];
    error?: string;
};


export async function getLinkDetails(url: string): Promise<LinkDetails> {
    const validatedUrl = GetLinkDetailsSchema.safeParse({ url });
    if (!validatedUrl.success) {
        return { title: '', description: '', image: null, error: 'Invalid URL provided.' };
    }

    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'LinkHubBot/1.0' }, signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
            return { title: '', description: '', image: null, error: 'Failed to fetch the URL.' };
        }
        const html = await response.text();

        const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
        let title = titleMatch ? titleMatch[1] : '';

        const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
        let description = descriptionMatch ? descriptionMatch[1] : '';
        
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
        let image = ogImageMatch ? ogImageMatch[1] : null;

        if (!title && !description) {
           // As a fallback, use the URL path as title if metadata is sparse
           const urlObject = new URL(url);
           title = urlObject.pathname.substring(1).replace(/[-_]/g, ' ') || urlObject.hostname;
        }

        try {
            const aiSuggestions = await categorizeLink({
                url,
                title,
                description,
            });
            return { title, description, image, category: aiSuggestions.category as Category, tags: aiSuggestions.tags };
        } catch (aiError) {
            console.error("AI suggestion failed:", aiError);
            // Return metadata even if AI fails
            return { title, description, image, error: "Could not get AI suggestions, please categorize manually." };
        }

    } catch (error) {
        console.error("Error fetching link details:", error);
        return { title: '', description: '', image: null, error: 'Could not fetch metadata from the URL.' };
    }
}
