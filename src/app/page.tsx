'use client';

import React from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { useSummarizer, type SummaryResult } from '@/hooks/use-summarizer';
import { SummarizerForm, type SummarizerFormValues } from '@/components/summarizer/summarizer-form';
import { SummaryDisplay } from '@/components/summarizer/summary-display';
import { QualityAnalyzer } from '@/components/summarizer/quality-analyzer';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { isPending, result, submit } = useSummarizer();

  const handleFormSubmit = (values: SummarizerFormValues) => {
    submit(values);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">Summarist</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <Card>
              <CardContent className="p-6">
                <SummarizerForm onSubmit={handleFormSubmit} isPending={isPending} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-8">
              {isPending && (
                <div className="flex h-[500px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating your summary, please wait...</p>
                </div>
              )}

              {!isPending && !result && (
                <div className="flex h-[500px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed">
                  <Bot className="h-16 w-16 text-muted-foreground/50" />
                  <p className="text-center text-muted-foreground">Your summary will appear here.</p>
                </div>
              )}

              {result && (
                <>
                  <SummaryDisplay summary={result.summary} />
                  <Separator />
                  <QualityAnalyzer originalText={result.originalText} summaryText={result.summary} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
