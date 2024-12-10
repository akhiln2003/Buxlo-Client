import { Iuser } from "@/@types/interface/IdataBase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IinitialState{
    user : null | Iuser
}


const initialState: IinitialState = {
   user : null 
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, { payload }: PayloadAction<Iuser | null>) {
            state.user = payload;
        }
    }
})

export const { addUser } = userSlice.actions;
export const userReducer = userSlice.reducer