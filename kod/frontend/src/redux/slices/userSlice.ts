import { createSlice } from "@reduxjs/toolkit";
import User from "../../models/dto/User";
import { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    user: any,
}

const initialState: UserState = {
    user: {},
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | {}>){
            state.user = action.payload
        }
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer