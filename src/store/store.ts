import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/api/authSlice";
import authInfoReducer from "../features/auth/authInfoSlice";
import { todoApi } from "../features/api/todoSlice";

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    authInfo: authInfoReducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authSlice.middleware)
      .concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
