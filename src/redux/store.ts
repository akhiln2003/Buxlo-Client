import { userApi } from "@/services/apis/AuthApis";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  userAuth: userReducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(userApi.middleware),
  devTools: true,
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type APPDispatch = typeof store.dispatch;
