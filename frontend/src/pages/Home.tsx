// Landing page for AI Fitness Assistant

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, MessageSquare, BarChart3, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">AI Fitness Assistant</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="gradient-primary" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AI Fitness Coach
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized fitness advice, workout plans, and nutrition guidance 
            powered by advanced AI technology. Start your transformation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-lg px-8" asChild>
              <Link to="/signup">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose AI Fitness Assistant?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of fitness coaching with personalized AI guidance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>AI Chat Coach</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get instant answers to your fitness questions from our intelligent AI coach
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>BMI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Personalized recommendations based on your age, weight, and fitness goals
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Workout Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Custom workout routines tailored to your fitness level and preferences
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Save and revisit your conversations to track your fitness journey
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto gradient-primary text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Fitness?</h3>
            <p className="mb-6 opacity-90">
              Join thousands of users who are already achieving their fitness goals with AI guidance
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-semibold">AI Fitness Assistant</span>
          </div>
          <p>&copy; 2024 AI Fitness Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
