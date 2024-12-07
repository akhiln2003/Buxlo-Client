import { userApi } from "@/services/apis/AuthApis";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";

const rootReducer = combineReducers({
  userAuth: userReducer,
  [userApi.reducerPath]: userApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type APPDispatch = typeof store.dispatch;
