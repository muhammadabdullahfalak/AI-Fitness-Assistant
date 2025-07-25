// Signup page component

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

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearAuthError } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearAuthError();
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast({
          title: "Account Created!",
          description: "Welcome to AI Fitness Assistant!",
        });
        navigate('/chat');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const result = await dispatch(googleLogin(credentialResponse.credential));
      console.log(credentialResponse.credential)
      if ((result as any).meta.requestStatus === 'fulfilled') {
        toast({
          title: 'Welcome!',
          description: 'You have successfully signed up with Google.',
        });
        navigate('/chat');
      } else {
        toast({
          title: 'Google Signup Failed',
          description: (result as any).payload || 'Could not sign up with Google.',
          variant: 'destructive',
        });
      }
    }
  };

  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Join AI Fitness</CardTitle>
              <CardDescription>
                Create your account and start your fitness journey
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col gap-4 px-6 pt-2">
              <div className="flex justify-center items-center w-full">
                <div className="min-w-[220px] max-w-xs w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast({ title: 'Google Signup Failed', description: 'Could not sign up with Google.', variant: 'destructive' })}
                    theme="outline"
                    size="large"
                    text="signup_with"
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
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

export default Signup;