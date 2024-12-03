import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
    theme: "d"
})


export const store = configureStore({
  reducer: rootReducer,
  devTools:true,

});


export type RootState = ReturnType< typeof  store.getState>;
export type APPDispatch = typeof store.dispatch;