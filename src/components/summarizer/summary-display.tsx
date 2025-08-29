'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit, Loader2, Sparkles, Wand2, BookOpen } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { handleInteractiveEdit } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SummaryDisplayProps {
  summary: string;
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const [sentences, setSentences] = useState<string[]>([]);
  const [isEditing, startEditTransition] = useTransition();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Basic sentence splitting. A more robust NLP library would be better for production.
    const splitSentences = summary.match(/[^.!?]+[.!?]+/g) || [summary];
    setSentences(splitSentences.map(s => s.trim()));
  }, [summary]);

  const handleEdit = (index: number, operation: 'simplify' | 'expand' | 'rephrase') => {
    setEditingIndex(index);
    startEditTransition(async () => {
      try {
        const sentenceToEdit = sentences[index];
        const result = await handleInteractiveEdit({ sentence: sentenceToEdit, operation });
        const newSentences = [...sentences];
        newSentences[index] = result.editedSentence;
        setSentences(newSentences);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Editing failed',
          description: error instanceof Error ? error.message : 'Could not edit the sentence.',
        });
      } finally {
        setEditingIndex(null);
      }
    });
  };

  const handleExportTxt = () => {
    const blob = new Blob([sentences.join(' ')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Generated Summary
        </CardTitle>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportTxt}>
                <Download className="mr-2 h-4 w-4" />
                Export as .txt
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4 text-card-foreground">
          <p>
            {sentences.map((sentence, index) => (
              <React.Fragment key={index}>
                <Popover>
                  <PopoverTrigger asChild>
                    <span
                      className={cn(
                        'cursor-pointer rounded-sm transition-colors hover:bg-accent/30',
                        { 'bg-accent/50': editingIndex === index }
                      )}
                    >
                      {isEditing && editingIndex === index ? (
                        <Loader2 className="mr-1 inline-block h-4 w-4 animate-spin" />
                      ) : null}
                      {sentence}{' '}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-1">
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(index, 'simplify')}>
                            <Wand2 className="mr-2 h-4 w-4" /> Simplify
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(index, 'expand')}>
                            <BookOpen className="mr-2 h-4 w-4" /> Expand
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(index, 'rephrase')}>
                            <Edit className="mr-2 h-4 w-4" /> Rephrase
                        </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </React.Fragment>
            ))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
