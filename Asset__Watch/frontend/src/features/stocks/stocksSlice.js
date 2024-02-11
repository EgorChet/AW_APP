import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/portfolio/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addStock = createAsyncThunk(
  "stocks/addStock",
  async (stockData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth; // Assuming you store user details in auth slice after login
      const response = await axiosInstance.post("/api/portfolio", {
        ...stockData,
        userId: user.id, // Optionally send userId if needed, but it's not required if using JWT
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    stocks: [],
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stocks = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addStock.fulfilled, (state, action) => {
        state.stocks.push(action.payload);
      });
  },
});

// Add this selector inside your portfolioSlice.js file
export const selectPortfolio = (state) => state.portfolio.stocks;

export default portfolioSlice.reducer;
