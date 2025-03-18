
import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ReviewSummary from '@/components/ReviewSummary';
import { Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { analyzeCode } from '@/services/codeAnalysisService';

const CodeReviewer: React.FC = () => {
  const [code, setCode] = useState('');
  const [review, setReview] = useState<null | {
    summary: string;
    issues: Array<{
      type: 'error' | 'warning' | 'info' | 'success';
      message: string;
      code?: string;
    }>;
  }>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to analyze",
        description: "Please enter some code in the editor first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await analyzeCode(code);
      setReview(result);
    } catch (error: any) {
      console.error("Error analyzing code:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "An error occurred during analysis",
        variant: "destructive",
      });
      
      setReview({
        summary: "Error analyzing code",
        issues: [{ 
          type: 'error', 
          message: error.message || "An unexpected error occurred during analysis." 
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col">
      <header className="responsive-container mb-8 animate-fade-in">
        <div className="inline-block mb-2 py-1 px-3 bg-primary/10 text-primary rounded-full text-xs font-medium">
          AI-Powered
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Code Reviewer</h1>
        <p className="text-muted-foreground">
          Get instant feedback on your code with our AI code review assistant
        </p>
      </header>
      
      <main className="responsive-container flex-grow grid gap-6 
                       grid-cols-1 lg:grid-cols-2 lg:gap-8 
                       animate-fade-in [animation-delay:200ms]">
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          className="lg:col-span-1"
        />
        
        <ReviewSummary 
          loading={loading} 
          review={review} 
          className="lg:col-span-1" 
        />
      </main>
      
      <div className="responsive-container mt-6 animate-fade-in [animation-delay:400ms]">
        <button
          onClick={handleAnalysis}
          disabled={loading || !code.trim()}
          className="flex items-center justify-center px-5 py-3 w-full sm:w-auto
                    font-medium rounded-lg transition-all duration-200
                    bg-primary text-primary-foreground
                    hover:bg-primary/90 focus:outline-none focus:ring-2 
                    focus:ring-primary/50 focus:ring-offset-2
                    disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Play size={18} className="mr-2" />
              Run Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeReviewer;
