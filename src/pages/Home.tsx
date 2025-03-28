import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Cpu, GitBranch } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 glow-effect">
            CodeReviewAI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Analyze, optimize, and compare code across multiple languages using
            advanced AI technology.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-8 gradient-button text-lg"
          >
            Get Started
            <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 glass-panel">
            <Code className="w-12 h-12 mb-4 text-accent-pink" />
            <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-muted-foreground">
              Analyze and convert code between Python, C, C++, Java, and Rust with ease.
            </p>
          </Card>

          <Card className="p-6 glass-panel">
            <Cpu className="w-12 h-12 mb-4 text-accent-yellow" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-muted-foreground">
              Get detailed insights into your code's time and space complexity.
            </p>
          </Card>

          <Card className="p-6 glass-panel">
            <GitBranch className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">[WIP] GitHub Integration</h3>
            <p className="text-muted-foreground">
              Save and manage your projects directly with GitHub integration.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}