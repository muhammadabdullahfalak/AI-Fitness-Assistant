// Chat slice for Redux store

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatThread, ChatMessage, UserProfile } from '@/constants/types';
import { API_ENDPOINTS } from '@/constants/api';
import { apiClient } from '@/utils/api';

interface ChatState {
  currentThread: ChatThread | null;
  threads: ChatThread[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
  chatStarted: boolean;
  newChatMode: boolean;
}

const initialState: ChatState = {
  currentThread: null,
  threads: [],
  userProfile: {
    age: '',
    sex: 'Male',
    weight: '',
  },
  isLoading: false,
  error: null,
  chatStarted: false,
  newChatMode: false,
};

// Async thunks
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (user_id: string, { rejectWithValue }) => {
    try {
      const response: { success: boolean; threads?: ChatThread[]; error?: string } = await apiClient.get(`${API_ENDPOINTS.CHAT_HISTORY}?user_id=${user_id}`);
      
      if (response.success) {
        return response.threads || [];
      } else {
        return rejectWithValue(response.error || 'Failed to fetch chat history');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chat history');
    }
  }
);

export const saveChatThread = createAsyncThunk(
  'chat/saveThread',
  async (thread: ChatThread, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SAVE_CHAT, thread);
      
      if (response.success) {
        return (response.data as { thread: ChatThread }).thread;
      } else {
        return rejectWithValue(response.error || 'Failed to save chat');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save chat');
    }
  }
);

export const deleteChatThread = createAsyncThunk(
  'chat/deleteThread',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.DELETE_CHAT}/${threadId}`);
      
      if (response.success) {
        return threadId;
      } else {
        return rejectWithValue(response.error || 'Failed to delete chat');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete chat');
    }
  }
);

const generateThreadId = () => `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    
    startNewThread: (state, action: PayloadAction<string>) => {
      const now = new Date().toISOString();
      const newThread: ChatThread = {
        id: generateThreadId(),
        user_id: action.payload, // <-- set user_id
        title: 'New Chat',
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      state.currentThread = newThread;
      state.threads.unshift(newThread); // Add to top
    },
    
    addMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      if (!state.currentThread) return;
      const now = new Date().toISOString();
      const message: ChatMessage = {
        id: generateMessageId(),
        timestamp: now,
        ...action.payload,
      };
      state.currentThread.messages.push(message);
      state.currentThread.updatedAt = now;
      // Update title if it's the first user message
      if (action.payload.sender === 'user' && state.currentThread.title === 'New Chat') {
        state.currentThread.title = action.payload.text.slice(0, 30) + (action.payload.text.length > 30 ? '...' : '');
      }
    },
    
    setCurrentThread: (state, action: PayloadAction<ChatThread | null>) => {
      state.currentThread = action.payload;
    },
    
    updateCurrentThreadTitle: (state, action: PayloadAction<string>) => {
      if (state.currentThread) {
        state.currentThread.title = action.payload;
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearCurrentThread: (state) => {
      state.currentThread = null;
    },

    setChatStarted: (state, action: PayloadAction<boolean>) => {
      state.chatStarted = action.payload;
    },
    resetChatStarted: (state) => {
      state.chatStarted = false;
    },

    createThreadWithWelcome: (state, action: PayloadAction<{ user_id: string, welcome: string }>) => {
      const now = new Date().toISOString();
      const newThread: ChatThread = {
        id: generateThreadId(),
        user_id: action.payload.user_id, // <-- set user_id
        title: 'New Chat',
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        timestamp: now,
        sender: 'ai',
        text: action.payload.welcome,
      };
      newThread.messages.push(welcomeMessage);
      newThread.updatedAt = now;
      state.currentThread = newThread;
      state.threads.unshift(newThread); // Add to top
    },
    enterNewChatMode: (state) => {
      state.newChatMode = true;
      state.currentThread = null;
    },
    exitNewChatMode: (state) => {
      state.newChatMode = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat history
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.threads = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Save chat thread
      .addCase(saveChatThread.fulfilled, (state, action) => {
        const savedThread = action.payload;
        const existingIndex = state.threads.findIndex(t => t.id === savedThread.id);
        
        if (existingIndex >= 0) {
          state.threads[existingIndex] = savedThread;
        } else {
          state.threads.push(savedThread);
        }
        
        if (state.currentThread?.id === savedThread.id) {
          state.currentThread = savedThread;
        }
      })
      
      // Delete chat thread
      .addCase(deleteChatThread.fulfilled, (state, action) => {
        const deletedThreadId = action.payload;
        state.threads = state.threads.filter(t => t.id !== deletedThreadId);
        
        if (state.currentThread?.id === deletedThreadId) {
          state.currentThread = null;
        }
      });
  },
});

export const {
  updateUserProfile,
  startNewThread,
  addMessage,
  setCurrentThread,
  updateCurrentThreadTitle,
  clearError,
  clearCurrentThread,
  createThreadWithWelcome,
  setChatStarted,
  resetChatStarted,
  enterNewChatMode,
  exitNewChatMode,
} = chatSlice.actions;

export default chatSlice.reducer;