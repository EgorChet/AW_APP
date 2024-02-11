import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import portfolioReducer from "../features/stocks/stocksSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer, // Add the portfolio reducer
  },
});

export default store;
