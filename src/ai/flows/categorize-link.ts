'use server';

/**
 * @fileOverview An AI agent that categorizes a given link based on its content.
 *
 * - categorizeLink - A function that categorizes a link.
 * - CategorizeLinkInput - The input type for the categorizeLink function.
 * - CategorizeLinkOutput - The return type for the categorizeLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategoriesSchema = z.enum([
  'News',
  'Technology',
  'Science',
  'Sports',
  'Finance',
  'Entertainment',
  'Travel',
  'Food',
  'Education',
  'Health',
  'Personal Development',
  'Other',
]);

const CategorizeLinkInputSchema = z.object({
  url: z.string().url().describe('The URL to categorize.'),
  title: z.string().describe('The title of the link.'),
  description: z.string().describe('The description of the link.'),
});

export type CategorizeLinkInput = z.infer<typeof CategorizeLinkInputSchema>;

const CategorizeLinkOutputSchema = z.object({
  category: CategoriesSchema.describe('The predicted category for the link.'),
  tags: z.array(z.string()).describe('Suggested tags for the link.'),
});

export type CategorizeLinkOutput = z.infer<typeof CategorizeLinkOutputSchema>;

export async function categorizeLink(input: CategorizeLinkInput): Promise<CategorizeLinkOutput> {
  return categorizeLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeLinkPrompt',
  input: {schema: CategorizeLinkInputSchema},
  output: {schema: CategorizeLinkOutputSchema},
  prompt: `You are an expert AI assistant specializing in categorizing links based on their content.

  Given the following information about a link, determine the most appropriate category from the provided list and suggest relevant tags.

  Categories: News, Technology, Science, Sports, Finance, Entertainment, Travel, Food, Education, Health, Personal Development, Other

  URL: {{{url}}}
  Title: {{{title}}}
  Description: {{{description}}}

  Respond with the category and a list of tags appropriate for the link. Return the output in JSON format.
  `,
});

const categorizeLinkFlow = ai.defineFlow(
  {
    name: 'categorizeLinkFlow',
    inputSchema: CategorizeLinkInputSchema,
    outputSchema: CategorizeLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
