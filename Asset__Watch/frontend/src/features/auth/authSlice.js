// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../config/axiosConfig"; // Import the configured Axios instance

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", userData);
      // Assuming successful registration doesn't automatically log the user in
      return response.data; // You might adjust this based on your backend response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/users/login", userData);
    const { accessToken, user, isProfileComplete, hasPortfolio } = response.data; // Assume these are now part of the response

    localStorage.setItem("token", accessToken);

    // Return user details for Redux state
    return {
      user: user,
      accessToken: accessToken,
      isProfileComplete: isProfileComplete,
      hasPortfolio: hasPortfolio,
    };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for checking the authentication state
export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/verify`);
      // console.log("CheckAuthState is working")
      // The server should return user information if authenticated
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;

      // Debugging: Log the user and profileData
      console.log("User:", user);
      console.log("Profile Data:", profileData);

      const response = await axiosInstance.post(
        `/users/updateProfile`,
        {
          ...profileData,
          userId: user.id,
        },
        {
          withCredentials: true,
        }
      );

      // Debugging: Log the response
      console.log("Response:", response);

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action for updating avatar URL
export const updateAvatarAction = createAsyncThunk(
  "auth/updateAvatar",
  async ({ avatarUrl }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth; // Get the user's ID from the state, if stored there
      // Make sure to adjust the endpoint according to your API's route
      const response = await axiosInstance.post(`/users/updateAvatar/${user.id}`, { avatarUrl });
      // Assuming the backend returns the updated user object, you can directly return this data
      return response.data;
    } catch (error) {
      // Use error.response.data to access the server's response
      return rejectWithValue(error.response.data.message || "Could not update avatar");
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isProfileComplete: false, // New field
  hasPortfolio: false, // New field
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null; // Clear accessToken from the state
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Clear the token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
        // Since you're not using the user data from the action here, no need to include it
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        // Ensure we're checking for action.payload.message first,
        // as action.payload might be structured differently based on the error.
        state.error = action.payload?.message || "Unknown error occurred.";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isProfileComplete = action.payload.isProfileComplete;
        state.hasPortfolio = action.payload.hasPortfolio;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.msg;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.status = "failed";
        state.error = action.payload.msg;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Update user info in state
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        // Update user info in state
        state.user = action.payload;
      })
      // Handle pending state if needed
      .addCase(updateAvatarAction.fulfilled, (state, action) => {
        // Assuming the updated user data is returned by the API
        // and that you store user data in state.auth.user
        state.user.avatarUrl = action.payload.avatarUrl;
        // Add any additional state updates here
      })
      // Handle rejected state if needed
      .addCase(updateAvatarAction.rejected, (state, action) => {
        // Handle the error, maybe set an error message in the state
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsProfileComplete = (state) => state.auth.isProfileComplete;
export const selectHasPortfolio = (state) => state.auth.hasPortfolio;

export const { logout } = authSlice.actions;

export default authSlice.reducer;