import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../models/User";

export interface NotificationState {
    type: string,
    message: string,
    status: boolean
}

const initialState: NotificationState = {
    type: 'success',
    message: 'Sukces',
    status: false
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationType(state, action: PayloadAction<string>){
            state.type = action.payload
        },
        setNotificationMessage(state, action: PayloadAction<string>){
            state.message = action.payload
        },
        setNotificationStatus(state, action: PayloadAction<boolean>){
            state.status = action.payload
        },
    }
})

export const { setNotificationType, setNotificationMessage, setNotificationStatus } = notificationSlice.actions

export default notificationSlice.reducer