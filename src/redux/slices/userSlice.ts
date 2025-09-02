import { IUserDB } from "@/@types/interface/IDataBase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IinitialState {
  user: null | IUserDB;
}

const initialState: IinitialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, { payload }: PayloadAction<IUserDB | null>) {
      state.user = payload;
    },
    logOut(state) {
      state.user = null;
    },
  },
});

export const { addUser, logOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
