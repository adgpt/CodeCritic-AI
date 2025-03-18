
import React from 'react';
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, FileCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewSummaryProps {
  loading: boolean;
  review: {
    summary: string;
    issues: Array<{
      type: 'error' | 'warning' | 'info' | 'success';
      message: string;
      code?: string;
    }>;
  } | null;
  className?: string;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ loading, review, className }) => {
  const handleDownload = () => {
    if (!review) return;
    
    let content = `# AI Code Review Summary\n\n`;
    content += `## Summary\n${review.summary}\n\n`;
    content += `## Issues & Improvements\n\n`;
    
    review.issues.forEach((issue, index) => {
      content += `### ${issue.type.toUpperCase()}: ${issue.message}\n`;
      if (issue.code) {
        content += "```\n" + issue.code + "\n```\n\n";
      } else {
        content += "\n";
      }
    });
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-review-summary.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
        <div className="border-b border-border bg-secondary/50 px-4 py-2 flex items-center">
          <span className="font-medium text-sm">AI Review Summary</span>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-5 shimmer rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 shimmer rounded w-full"></div>
            <div className="h-4 shimmer rounded w-5/6"></div>
            <div className="h-4 shimmer rounded w-4/6"></div>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
            <div className="h-4 shimmer rounded w-full"></div>
            <div className="h-4 shimmer rounded w-5/6"></div>
            <div className="h-4 shimmer rounded w-3/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 shimmer rounded w-full"></div>
            <div className="h-4 shimmer rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className={cn("rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
        <div className="border-b border-border bg-secondary/50 px-4 py-2 flex items-center">
          <span className="font-medium text-sm">AI Review Summary</span>
        </div>
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-muted-foreground">
          <FileCode size={48} className="mb-4 opacity-50" />
          <p className="text-center">Run the analysis to get a code review summary</p>
        </div>
      </div>
    );
  }

  const getIconForIssueType = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle size={18} className="text-destructive shrink-0" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-500 shrink-0" />;
      case 'info':
        return <Info size={18} className="text-blue-500 shrink-0" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-500 shrink-0" />;
      default:
        return <Info size={18} className="text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
      <div className="border-b border-border bg-secondary/50 px-4 py-2 flex items-center justify-between">
        <span className="font-medium text-sm">AI Review Summary</span>
        {review && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownload}
            className="h-8 px-2"
          >
            <Download size={16} className="mr-1" />
            <span className="text-xs">Download</span>
          </Button>
        )}
      </div>
      <div className="p-6 space-y-6 overflow-auto max-h-[calc(100vh-250px)]">
        <div className="animate-fade-in">
          <h3 className="text-lg font-medium mb-3">Summary</h3>
          <p className="text-muted-foreground break-words">{review?.summary}</p>
        </div>

        <div className="animate-fade-in [animation-delay:100ms]">
          <h3 className="text-lg font-medium mb-3">Issues & Improvements</h3>
          <div className="space-y-4">
            {review?.issues.map((issue, index) => (
              <div 
                key={index} 
                className={cn(
                  "rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
                  {
                    'border-destructive/20 bg-destructive/5': issue.type === 'error',
                    'border-yellow-500/20 bg-yellow-500/5': issue.type === 'warning',
                    'border-blue-500/20 bg-blue-500/5': issue.type === 'info',
                    'border-green-500/20 bg-green-500/5': issue.type === 'success',
                  }
                )}
              >
                <div className="flex gap-3">
                  {getIconForIssueType(issue.type)}
                  <div className="space-y-2 w-full">
                    <p className="text-sm break-words">{issue.message}</p>
                    {issue.code && (
                      <pre className="text-sm bg-secondary/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                        <code>{issue.code}</code>
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
