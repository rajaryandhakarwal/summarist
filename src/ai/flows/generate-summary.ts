'use server';

/**
 * @fileOverview Generates a summary of the content provided by the user.
 *
 * - generateSummary - A function that handles the summary generation process.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 * - GenerateSummaryOutput - The return type for the generateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSummaryInputSchema = z.object({
  text: z.string().optional().describe('The text to summarize.'),
  fileDataUri: z.string().optional().describe(
    'The content of the file to summarize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
  ),
  mode: z.enum(['Extractive', 'Abstractive', 'Hybrid']).default('Abstractive').describe('The summarization mode.'),
  domain: z.enum(['General', 'Legal', 'News', 'Medical', 'Academic']).default('General').describe('The domain of the text.'),
  blend: z.number().min(0).max(1).default(0.5).describe('The blend between extractive and abstractive summary generation (0 = extractive, 1 = abstractive).'),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated summary.'),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

export async function generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  return generateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {schema: GenerateSummaryInputSchema},
  output: {schema: GenerateSummaryOutputSchema},
  prompt: `You are an expert summarizer. You will generate a summary of the provided text or file content, considering the specified mode, domain, and blend.

Mode: {{{mode}}}
Domain: {{{domain}}}
Blend: {{{blend}}}

{{#if text}}
Text: {{{text}}}
{{/if}}

{{#if fileDataUri}}
File Content: {{media url=fileDataUri}}
{{/if}}

Summary:`, // Removed unnecessary newlines and backslashes
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
