import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import keycloakReducer from './slices/keycloakSlice'

const rootReducer = combineReducers({
    user: userReducer,
    keycloak: keycloakReducer
});

export default rootReducer;