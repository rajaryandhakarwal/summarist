'use server';

import {
  generateSummary,
  type GenerateSummaryInput,
} from '@/ai/flows/generate-summary';
import {
  interactiveSummaryEditing,
  type InteractiveSummaryEditingInput,
} from '@/ai/flows/interactive-summary-editing';

export async function handleGenerateSummary(input: GenerateSummaryInput) {
  try {
    const output = await generateSummary(input);
    return { summary: output.summary };
  } catch (error) {
    console.error('Error in handleGenerateSummary:', error instanceof Error ? error.stack : error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    throw new Error(`Failed to generate summary. ${message}`);
  }
}

export async function handleInteractiveEdit(
  input: InteractiveSummaryEditingInput
) {
  try {
    const output = await interactiveSummaryEditing(input);
    return { editedSentence: output.editedSentence };
  } catch (error) {
    console.error('Error in handleInteractiveEdit:', error instanceof Error ? error.stack : error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    throw new Error(`Failed to edit sentence. ${message}`);
  }
}
