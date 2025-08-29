'use client';

import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { File, X, BrainCircuit, Loader2 } from 'lucide-react';

const formSchema = z.object({
  text: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    dataUri: z.string(),
  })).max(1, 'Please upload only one file at a time.').optional(),
  mode: z.enum(['Abstractive', 'Extractive', 'Hybrid']),
  domain: z.enum(['General', 'Legal', 'News', 'Medical', 'Academic']),
  blend: z.number().min(0).max(1),
}).refine(data => data.text || (data.files && data.files.length > 0), {
  message: 'Please enter text or upload a file.',
  path: ['text'],
});

export type SummarizerFormValues = z.infer<typeof formSchema>;

interface SummarizerFormProps {
  onSubmit: (values: SummarizerFormValues) => void;
  isPending: boolean;
}

export function SummarizerForm({ onSubmit, isPending }: SummarizerFormProps) {
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
  
  const form = useForm<SummarizerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      files: [],
      mode: 'Abstractive',
      domain: 'General',
      blend: 0.5,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        form.setError('files', { type: 'manual', message: 'Only PDF and DOCX files are accepted.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        form.setValue('files', [{ name: file.name, dataUri }], { shouldValidate: true });
        form.clearErrors('text');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    form.setValue('files', [], { shouldValidate: true });
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const watchedMode = form.watch('mode');
  const watchedFiles = form.watch('files');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'text' | 'file')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>
        </Tabs>

        {inputMethod === 'text' ? (
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your article, report, or any text you want to summarize here..."
                    className="min-h-[150px] resize-y"
                    {...field}
                    onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors('files');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <FormItem>
                <FormLabel>Upload a document</FormLabel>
                {watchedFiles && watchedFiles.length > 0 ? (
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <File className="h-5 w-5 shrink-0 text-primary"/>
                            <span className="truncate text-sm">{watchedFiles[0].name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="h-6 w-6">
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <FormControl>
                        <Input id="file-upload" type="file" accept=".pdf,.docx" onChange={handleFileChange} />
                    </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summarization Mode</FormLabel>
              <FormControl>
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Abstractive">Abstractive</TabsTrigger>
                    <TabsTrigger value="Extractive">Extractive</TabsTrigger>
                    <TabsTrigger value="Hybrid">Hybrid</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
            </FormItem>
          )}
        />
        
        {watchedMode === 'Hybrid' && (
          <FormField
            control={form.control}
            name="blend"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>
                  Blend: <span className="font-mono text-primary">{value.toFixed(2)}</span>
                </FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">Extractive</span>
                      <Slider
                        defaultValue={[value]}
                        max={1}
                        step={0.01}
                        onValueChange={(vals) => onChange(vals[0])}
                      />
                    <span className="text-sm text-muted-foreground">Abstractive</span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['General', 'Legal', 'News', 'Medical', 'Academic'].map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>
      </form>
    </Form>
  );
}
