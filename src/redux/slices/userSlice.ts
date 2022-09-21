import { createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    user: User,
    username: string,
    roles: string[]
}

const initialState: UserState = {
    user: {} as User,
    username: '',
    roles: []
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setRoles(state, action: PayloadAction<string[]>){
            state.roles = action.payload
        },
        setUser(state, action: PayloadAction<User>){
            state.user = action.payload
        },
        setUsername(state, action: PayloadAction<string>){
            state.username = action.payload
        }
    }
})

export const { setRoles, setUser, setUsername } = userSlice.actions

export default userSlice.reducer