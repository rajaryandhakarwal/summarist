'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Scale, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface QualityAnalyzerProps {
  originalText: string;
  summaryText: string;
}

interface Metrics {
    compressionRatio: number;
    readabilityScore: number;
    faithfulnessScore: number;
    keywordRetention: number;
}

const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = getScoreColor(score);
  const Icon = color === 'success' ? CheckCircle2 : color === 'warning' ? AlertTriangle : XCircle;
  
  const colorClass = {
    success: 'bg-green-500 hover:bg-green-500/80',
    warning: 'bg-yellow-500 hover:bg-yellow-500/80',
    error: 'bg-red-500 hover:bg-red-500/80'
  }[color]

  return (
    <Badge className={cn('text-white', colorClass)}>
      <Icon className="mr-1 h-3 w-3" />
      {
        {
          success: 'Good',
          warning: 'Okay',
          error: 'Needs Improvement'
        }[color]
      }
    </Badge>
  );
};


export function QualityAnalyzer({ originalText, summaryText }: QualityAnalyzerProps) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    // Generate metrics on the client-side to avoid hydration mismatch
    const originalLength = originalText.split(/\s+/).filter(Boolean).length;
    const summaryLength = summaryText.split(/\s+/).filter(Boolean).length;
    const compressionRatio = originalLength > 0 ? Math.max(0, (1 - summaryLength / originalLength)) * 100 : 0;
    
    // Dummy data for other metrics for demonstration purposes
    const readabilityScore = Math.floor(Math.random() * (95 - 65 + 1) + 65); // Generates a score between 65 and 95
    const faithfulnessScore = Math.floor(Math.random() * (98 - 75 + 1) + 75); // Generates a score between 75 and 98
    const keywordRetention = Math.floor(Math.random() * (92 - 70 + 1) + 70); // Generates a score between 70 and 92

    setMetrics({
      compressionRatio,
      readabilityScore,
      faithfulnessScore,
      keywordRetention,
    });
  }, [originalText, summaryText]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Gauge className="h-6 w-6 text-primary" />
            Quality Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {metrics ? (
          <>
            <MetricItem
              icon={<TrendingUp className="h-5 w-5 text-accent" />}
              title="Compression Ratio"
              value={`${metrics.compressionRatio.toFixed(1)}%`}
              progress={metrics.compressionRatio}
              description="Reduction in length from original text."
              score={metrics.compressionRatio}
            />
            <MetricItem
              icon={<Scale className="h-5 w-5 text-accent" />}
              title="Readability Score"
              value={metrics.readabilityScore.toFixed(0)}
              progress={metrics.readabilityScore}
              description="Flesch Reading Ease (higher is better)."
              score={metrics.readabilityScore}
            />
            <MetricItem
              icon={<ShieldCheck className="h-5 w-5 text-accent" />}
              title="Faithfulness Score"
              value={metrics.faithfulnessScore.toFixed(0)}
              progress={metrics.faithfulnessScore}
              description="How accurately the summary reflects the source."
              score={metrics.faithfulnessScore}
            />
            <MetricItem
              icon={<CheckCircle2 className="h-5 w-5 text-accent" />}
              title="Keyword Retention"
              value={metrics.keywordRetention.toFixed(0)}
              progress={metrics.keywordRetention}
              description="Percentage of original keywords kept."
              score={metrics.keywordRetention}
            />
          </>
        ) : (
            Array.from({ length: 4 }).map((_, index) => <MetricSkeleton key={index} />)
        )}
      </CardContent>
    </Card>
  );
}

interface MetricItemProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    progress: number;
    description: string;
    score: number;
}

function MetricItem({ icon, title, value, progress, description, score }: MetricItemProps) {
    const colorClass = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    }[getScoreColor(score)];

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h4 className="font-semibold">{title}</h4>
                </div>
                <span className="font-mono text-lg font-bold text-primary">{value}</span>
            </div>
            <Progress value={progress} indicatorClassName={colorClass} />
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{description}</p>
                <ScoreBadge score={score} />
            </div>
        </div>
    )
}

function MetricSkeleton() {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
        </div>
    )
}
