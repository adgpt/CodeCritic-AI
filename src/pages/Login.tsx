import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in with Google',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGithub();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in with GitHub',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md animate-fade-up">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button
              className="w-full h-11 text-base font-medium transition-all duration-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:shadow-md"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FaGoogle className="mr-2 text-red-500" />
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>
            <Button
              className="w-full h-11 text-base font-medium transition-all duration-200 bg-[#24292e] hover:bg-[#2f363d] text-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:shadow-md"
              onClick={handleGithubSignIn}
              disabled={loading}
            >
              <FaGithub className="mr-2" />
              {loading ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}