import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Iusr {
    name:string,
    email:string
}

const initialState ={
    name:'',
    email:'',
    
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        addUser( state , action:PayloadAction<Iusr>){
            state = action.payload
        }
    }
})

export const { addUser } = userSlice.actions;
export const userReducer = userSlice.reducer