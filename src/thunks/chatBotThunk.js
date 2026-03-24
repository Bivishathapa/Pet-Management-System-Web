import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

function buildChatPayload(message, messages) {
  const trimmed = (message || '').trim();
  const withText = (messages || []).filter((m) => m.text && String(m.text).trim());

  const prior = [...withText];
  const last = prior[prior.length - 1];
  if (last && last.sender === 'user' && String(last.text).trim() === trimmed) {
    prior.pop();
  }

  const history = prior.map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: String(m.text).trim(),
  }));

  let lastAssistant;
  for (let i = prior.length - 1; i >= 0; i--) {
    if (prior[i].sender !== 'user') {
      lastAssistant = String(prior[i].text).trim();
      break;
    }
  }

  return { message: trimmed, history, lastAssistant };
}

export const sendChatMessage = createAsyncThunk(
  'chatBot/sendMessage',
  async ({ message }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { messages } = state.chatBot;
      const authUser = state.auth?.user;
      const resolvedUser =
        authUser?.data?.user ||
        authUser?.user ||
        authUser ||
        null;
      const userId = resolvedUser?.id || undefined;
      const body = buildChatPayload(message, messages);
      if (userId) {
        body.userId = userId;
      }
      const response = await api.post('v1/api/chatbot/create', body, {
        timeout: 20000,
      });
      return {
        response: response.data.reply || response.data.response || response.data.message || 'No response from server',
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);