import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import keycloakReducer from './slices/keycloakSlice'
import notificationReducer from './slices/notificationSlice'

const rootReducer = combineReducers({
    user: userReducer,
    keycloak: keycloakReducer,
    notification: notificationReducer
});

export default rootReducer;