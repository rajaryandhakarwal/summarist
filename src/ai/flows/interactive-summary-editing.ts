'use server';

/**
 * @fileOverview Implements the Genkit flow for interactive summary editing.
 *
 * - interactiveSummaryEditing - A function that allows users to simplify, expand, or rephrase sentences in a generated summary.
 * - InteractiveSummaryEditingInput - The input type for the interactiveSummaryEditing function.
 * - InteractiveSummaryEditingOutput - The return type for the interactiveSummaryEditing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveSummaryEditingInputSchema = z.object({
  sentence: z.string().describe('The sentence to be edited.'),
  operation: z.enum(['simplify', 'expand', 'rephrase']).describe('The type of edit operation to perform.'),
});
export type InteractiveSummaryEditingInput = z.infer<typeof InteractiveSummaryEditingInputSchema>;

const InteractiveSummaryEditingOutputSchema = z.object({
  editedSentence: z.string().describe('The edited sentence.'),
});
export type InteractiveSummaryEditingOutput = z.infer<typeof InteractiveSummaryEditingOutputSchema>;

export async function interactiveSummaryEditing(input: InteractiveSummaryEditingInput): Promise<InteractiveSummaryEditingOutput> {
  return interactiveSummaryEditingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveSummaryEditingPrompt',
  input: {schema: InteractiveSummaryEditingInputSchema},
  output: {schema: InteractiveSummaryEditingOutputSchema},
  prompt: `You are a helpful AI assistant that helps users edit sentences in a summary.

The user wants to perform the following operation: {{operation}}

On the following sentence: {{sentence}}

Please perform the requested operation and return the edited sentence.

For simplify, make the sentence easier to read.  For expand, add more detail to the sentence. For rephrase, reword the sentence.
`,
});

const interactiveSummaryEditingFlow = ai.defineFlow(
  {
    name: 'interactiveSummaryEditingFlow',
    inputSchema: InteractiveSummaryEditingInputSchema,
    outputSchema: InteractiveSummaryEditingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
