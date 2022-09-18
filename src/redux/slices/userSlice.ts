import { createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    user: User,
    roles: string[]
}

const initialState: UserState = {
    user: {} as User,
    roles: []
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setRoles(state, action: PayloadAction<string[]>){
            state.roles = action.payload
        }
    }
})

export const { setRoles } = userSlice.actions

export default userSlice.reducer