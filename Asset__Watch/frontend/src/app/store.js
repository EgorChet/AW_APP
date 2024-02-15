import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "../features/auth/authSlice";
import portfolioReducer from "../features/stocks/stocksSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "portfolio"], // Only auth and portfolio will be persisted
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from serializability check
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import authReducer from "../features/auth/authSlice";
// import portfolioReducer from "../features/stocks/stocksSlice";

// // Combine reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
//   portfolio: portfolioReducer,
// });

// // Configuration for redux-persist
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth", "portfolio"],
// };

// // Create a persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
// });

// store.subscribe(() => {

// });

// export const persistor = persistStore(store);

// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/auth/authSlice";
// import portfolioReducer from "../features/stocks/stocksSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     portfolio: portfolioReducer, // Add the portfolio reducer
//   },
// });

// export default store;

// store.subscribe(() => {
//   // const state = store.getState();
//   // console.log(state);
//   // console.log("State after rehydration:", state);
//   // console.log("Auth state:", state.auth);
//   // console.log("Portfolio state:", state.portfolio);
//   // console.log("Persist state:", state._persist);
// });
