// Profile setup component for new users

import { useFitnessChat } from '@/hooks/useFitnessChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, User, Scale, Calendar } from 'lucide-react';
import { getBMIAnalysis } from '@/utils/bmi';
import { useDispatch, useSelector } from 'react-redux';
import { exitNewChatMode, setChatStarted, createThreadWithWelcome } from '@/store/slices/chatSlice';
import { RootState } from '@/store';

export const ProfileSetup = () => {
  const { userProfile, updateProfile, chatStarted } = useFitnessChat();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile('age', e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile('weight', e.target.value);
  };

  const handleSexChange = (value: 'Male' | 'Female') => {
    updateProfile('sex', value);
  };

  const isFormValid = userProfile.age && userProfile.weight && userProfile.sex;
  
  // Calculate BMI if we have weight (assuming average height for demo)
  const getBMIInfo = () => {
    if (!userProfile.weight) return null;
    
    // Using average height for BMI calculation demo (170cm)
    const avgHeight = 170;
    const weight = parseFloat(userProfile.weight);
    
    if (isNaN(weight)) return null;
    
    return getBMIAnalysis(weight, avgHeight);
  };

  const bmiInfo = getBMIInfo();

  const startChat = () => {
    // ...profile validation...
    const welcomeMessage = `🏋️ Welcome to your AI Fitness Assistant! I'm here to help you with personalized fitness advice based on your profile:\n\n👤 **Age:** ${userProfile.age}\n⚧ **Sex:** ${userProfile.sex}\n⚖️ **Weight:** ${userProfile.weight}kg\n\nFeel free to ask me anything about fitness, workouts, nutrition, or health! How can I help you today?`;
    dispatch(setChatStarted(true));
    dispatch(createThreadWithWelcome({ user_id: user.id, welcome: welcomeMessage }));
    dispatch(exitNewChatMode());
  };

  if (chatStarted) {
    return null; // Let ChatInterface handle the chat
  }

  return (
    <div className="flex-1 gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to AI Fitness Assistant</CardTitle>
            <CardDescription className="text-lg">
              Let's set up your profile to provide personalized fitness guidance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={userProfile.age}
                  onChange={handleAgeChange}
                  min="1"
                  max="120"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sex" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sex
                </Label>
                <Select value={userProfile.sex} onValueChange={handleSexChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kg"
                  value={userProfile.weight}
                  onChange={handleWeightChange}
                  min="1"
                  max="500"
                  step="0.1"
                />
              </div>
            </div>

            {/* BMI Preview */}
            {bmiInfo && (
              <Card className="bg-accent/50 border-accent">
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">BMI Preview</h3>
                    <div className="text-2xl font-bold text-primary">
                      {bmiInfo.bmi} - {bmiInfo.category}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bmiInfo.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      *Calculated using average height for demonstration
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center pt-4">
              <Button
                onClick={startChat}
                disabled={!isFormValid}
                className="px-8 py-3 text-lg gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Start Your Fitness Journey
              </Button>
            </div>
            
            {!isFormValid && (
              <p className="text-center text-sm text-muted-foreground">
                Please fill in all fields to continue
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};