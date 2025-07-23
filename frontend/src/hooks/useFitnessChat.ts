import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChatMessage, ChatState, UserProfile, FitnessApiResponse } from '@/constants/types';
import { toast } from '@/hooks/use-toast';
import { RootState } from '@/store';
import { addMessage, updateUserProfile, startNewThread, createThreadWithWelcome, setChatStarted, resetChatStarted } from '@/store/slices/chatSlice';
import { API_ENDPOINTS } from '@/constants/api';
import { apiClient } from '@/utils/api';
import type { AppDispatch } from '@/store';

export const useFitnessChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentThread, userProfile, chatStarted } = useSelector((state: RootState) => state.chat);
  
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamText: ''
  });

  const startChat = useCallback(() => {
    if (!userProfile.age || !userProfile.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in your age and weight to continue.",
        variant: "destructive"
      });
      return;
    }

    dispatch(setChatStarted(true));
    
    const welcomeMessage = `🏋️ Welcome to your AI Fitness Assistant! I'm here to help you with personalized fitness advice based on your profile:\n\n👤 **Age:** ${userProfile.age}\n⚧ **Sex:** ${userProfile.sex}\n⚖️ **Weight:** ${userProfile.weight}kg\n\nFeel free to ask me anything about fitness, workouts, nutrition, or health! How can I help you today?`;
    
    dispatch(createThreadWithWelcome(welcomeMessage));
  }, [userProfile, dispatch]);

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || !currentThread) return;

    // Add user message
    dispatch(addMessage({
      sender: 'user',
      text: userInput.trim(),
    }));

    setChatState(prev => ({
      ...prev,
      isLoading: true
    }));

    try {
      const prompt = `
You are a professional fitness and health expert. The user's profile:
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} kg

Only answer fitness, health, nutrition, or workout-related questions. If the question is not related to fitness, politely redirect them to fitness topics.

User question: ${userInput}

Provide helpful, personalized advice based on their profile. Be encouraging and motivational!
`;

      const response = await apiClient.post(API_ENDPOINTS.GEMINI, { prompt });
      
      if (response.success) {
        const data = response.data as FitnessApiResponse;
        dispatch(addMessage({
          sender: 'ai',
          text: data.text,
        }));
      } else {
        throw new Error(response.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setChatState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, [userProfile, currentThread, dispatch]);

  const updateProfile = useCallback((field: keyof UserProfile, value: string) => {
    dispatch(updateUserProfile({ [field]: value }));
  }, [dispatch]);

  const resetChat = useCallback(() => {
    dispatch(resetChatStarted());
    setChatState({
      messages: [],
      isLoading: false,
      isStreaming: false,
      streamText: ''
    });
  }, [dispatch]);

  return {
    userProfile,
    chatState,
    chatStarted,
    currentThread,
    updateProfile,
    startChat,
    sendMessage,
    resetChat
  };
};