import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../thunks/loginThunk';

const getInitialState = () => {
  const accessToken = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');

  if (accessToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        user,
        accessToken,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      };
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  return {
    user: null,
    accessToken: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  };
};

const loginSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;     
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setCredentials } = loginSlice.actions;
export default loginSlice.reducer;