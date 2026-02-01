import { createSlice } from '@reduxjs/toolkit';
import { sendChatMessage } from '../thunks/chatBotThunk';

const chatBotSlice = createSlice({
  name: 'chatBot',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        text: action.payload,
        sender: 'user',
        timestamp: new Date().toISOString(),
      });
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    resetChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: Date.now(),
          text: action.payload.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        });
        state.error = null;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send message';
        state.messages.push({
          id: Date.now(),
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true,
        });
      });
  },
});

export const { addUserMessage, clearMessages, resetChatError } = chatBotSlice.actions;
export default chatBotSlice.reducer;