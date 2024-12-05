import { Iuser } from "@/@types/interface/IdataBase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IinitialState{
    userData : null | Iuser
}


const initialState: IinitialState = {
   userData : null 
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, { payload }: PayloadAction<Iuser>) {
            state.userData = payload;
        }
    }
})

export const { addUser } = userSlice.actions;
export const userReducer = userSlice.reducer