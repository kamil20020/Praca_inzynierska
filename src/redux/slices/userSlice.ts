import { createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";

export interface UserState {
    user: User
}

const initialState: UserState = {
    user: {} as User
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

    }
})

//export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default userSlice.reducer