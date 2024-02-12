// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../config/axiosConfig"; // Import the configured Axios instance

// const BASE_URL = "http://localhost:3001";
const BASE_URL = process.env.REACT_APP_BASE_URL || '';

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", userData);
      // Assuming successful registration doesn't automatically log the user in
      return response.data; // You might adjust this based on your backend response
    } catch (error) {
      // return rejectWithValue(error.response.data);
      return rejectWithValue({ msg: 'An unexpected error occurred' });
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
    // return rejectWithValue(error.response.data);
    return rejectWithValue({ msg: 'An unexpected error occurred' });
  }
});

// Async thunk for checking the authentication state
export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/verify`);
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
      state.isAuthenticated = false;
      // Assuming you have a logout endpoint that clears the HTTP-Only cookie
      axios
        .post(`${BASE_URL}/users/logout`)
        .then(() => {
          console.log("User logged out");
        })
        .catch((error) => {
          console.error("Logout error", error);
        });
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
        state.error = action.payload.msg;
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

// export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post(`/users/login`, userData);
//     const { accessToken, email } = response.data;

//     // Store the access token in localStorage for later use
//     // After storing the token in loginUser async thunk or similar login handling function
//     localStorage.setItem("token", accessToken);
//     console.log("Token stored in localStorage:", localStorage.getItem("token"));

//     // Return user details for Redux state (adjust according to your needs)
//     return { user: { email }, accessToken };
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

// .addCase(loginUser.fulfilled, (state, action) => {
//   // Store both user details and accessToken in the state
//   state.user = action.payload.user;
//   state.accessToken = action.payload.accessToken; // Store the accessToken
//   state.isAuthenticated = true;
//   state.status = "succeeded";
//   state.error = null;
// })

// const initialState = {
//   user: null,
//   accessToken: null,
//   isAuthenticated: false,
//   status: "idle",
//   error: null,
// };
