import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "@/services/apis/AuthApis";
import { mentorApi } from "@/services/apis/MentorApis";
import { userApi } from "@/services/apis/UserApis";
import { commonApi } from "@/services/apis/CommonApis";
import { adminApi } from "@/services/apis/AdminApis";

const rootReducer = combineReducers({
  userAuth: userReducer,
  [authApi.reducerPath]: authApi.reducer,
  [mentorApi.reducerPath]: mentorApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [commonApi.reducerPath]: commonApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [authApi.reducerPath, mentorApi.reducerPath, userApi.reducerPath , adminApi.reducerPath , commonApi.reducerPath ], // Don't persist API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware, mentorApi.middleware, userApi.middleware , adminApi.middleware , commonApi.middleware),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
