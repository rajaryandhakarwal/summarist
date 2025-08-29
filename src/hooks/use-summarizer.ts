'use client';

import React, { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateSummary } from '@/app/actions';
import type { SummarizerFormValues } from '@/components/summarizer/summarizer-form';

export interface SummaryResult {
  summary: string;
  originalText: string;
}

export function useSummarizer() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SummaryResult | null>(null);
  const { toast } = useToast();

  const submit = (values: SummarizerFormValues) => {
    startTransition(async () => {
      setResult(null); // Clear previous results
      const { text, files, ...options } = values;
      const originalText = text || (files?.[0]?.name ?? 'uploaded file');

      try {
        const fileDataUri = files?.[0]?.dataUri;
        const response = await handleGenerateSummary({ ...options, text, fileDataUri });

        if (response.summary) {
          setResult({ summary: response.summary, originalText });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to generate summary. The response was empty.',
          });
        }
      } catch (error) {
        console.error('Summarization submission error:', error);
        
        let description = 'An unknown error occurred while generating the summary.';
        if (error instanceof Error) {
          if (error.message.includes('503 Service Unavailable')) {
            description = 'The summarization service is currently overloaded. Please try again in a moment.';
          } else {
            // Display the core error message without the "Error: Failed to..." prefix.
            description = error.message.replace(/^Error: Failed to generate summary. /, '');
          }
        }

        toast({
          variant: 'destructive',
          title: 'Summarization Failed',
          description,
        });
      }
    });
  };

  return { isPending, result, submit };
}
