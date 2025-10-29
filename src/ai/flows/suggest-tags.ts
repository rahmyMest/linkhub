'use server';
/**
 * @fileOverview Suggests tags for a given link using an LLM.
 *
 * - suggestTagsForLink - A function that suggests tags for a given link.
 * - SuggestTagsForLinkInput - The input type for the suggestTagsForLink function.
 * - SuggestTagsForLinkOutput - The return type for the suggestTagsForLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsForLinkInputSchema = z.object({
  url: z.string().url().describe('The URL to suggest tags for.'),
  title: z.string().describe('The title of the link.'),
  description: z.string().describe('The description of the link.'),
  defaultCategories: z.array(z.string()).describe('A list of default categories that the AI tool can assess when new URLs are added')
});
export type SuggestTagsForLinkInput = z.infer<typeof SuggestTagsForLinkInputSchema>;

const SuggestTagsForLinkOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of suggested tags for the link.'),
});
export type SuggestTagsForLinkOutput = z.infer<typeof SuggestTagsForLinkOutputSchema>;

export async function suggestTagsForLink(input: SuggestTagsForLinkInput): Promise<SuggestTagsForLinkOutput> {
  return suggestTagsForLinkFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsForLinkInputSchema},
  output: {schema: SuggestTagsForLinkOutputSchema},
  prompt: `Suggest relevant tags for the following link, title, and description.

Link: {{{url}}}
Title: {{{title}}}
Description: {{{description}}}
Default Categories: {{{defaultCategories}}}

Tags:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestTagsForLinkFlow = ai.defineFlow(
  {
    name: 'suggestTagsForLinkFlow',
    inputSchema: SuggestTagsForLinkInputSchema,
    outputSchema: SuggestTagsForLinkOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
