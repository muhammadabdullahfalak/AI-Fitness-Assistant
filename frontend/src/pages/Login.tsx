// Login page component

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Activity } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { googleLogin } from '@/store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearAuthError } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await login(formData);
      if (result.meta.requestStatus === 'fulfilled') {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/chat');
      }
    } catch (error) {
      // Error handling is done in the slice
      console.error('Login error:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const result = await dispatch(googleLogin(credentialResponse.credential));
      if ((result as any).meta.requestStatus === 'fulfilled') {
        toast({
          title: 'Welcome!',
          description: 'You have successfully logged in with Google.',
        });
        navigate('/chat');
      } else {
        toast({
          title: 'Google Login Failed',
          description: (result as any).payload || 'Could not log in with Google.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your AI Fitness Assistant account
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col gap-4 px-6 pt-2">
              <div className="flex justify-center items-center w-full">
                <div className="min-w-[220px] max-w-xs w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast({ title: 'Google Login Failed', description: 'Could not log in with Google.', variant: 'destructive' })}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                  />
                </div>
              </div>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-muted-foreground/20" />
                <span className="mx-2 text-muted-foreground text-xs">or</span>
                <div className="flex-grow border-t border-muted-foreground/20" />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;