import { Button, FormControl, FormHelperText, Grid, Hidden, Input, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import KeycloakService from "../../../keycloak/KeycloakService";
import { keycloakSlice, logout, setAccessToken, setRefreshToken } from "../../../redux/slices/keycloakSlice";
import { setNotificationMessage, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import { RootState, store } from "../../../redux/store";
import XCloeasableDialog from "../../common/XCloeasableDialog";

interface FormFields {
    username_email: string,
    password: string
}

const Login = () => {

    const keycloak = useSelector((state: RootState) => state.keycloak)
    const dispatch = useDispatch()

    const [form, setForm] = React.useState<FormFields>({
        username_email: '',
        password: ''
    })

    const handleSubmit = () => {

        KeycloakService.login(form)
        .then((response: any) => {
            const data = response.data
            const accessToken =  data.access_token
            const accessTokenExpiresIn = data.expires_in
            const refreshToken = data.refresh_token
            const refreshTokenExpiresIn = data.refresh_expires_in
            dispatch(setAccessToken({token: accessToken, expires_in: accessTokenExpiresIn}))
            dispatch(setRefreshToken({token: refreshToken, expires_in: refreshTokenExpiresIn}))

            dispatch(setNotificationMessage('Zalogowano pomyślnie'))
            dispatch(setNotificationStatus(true))
            console.log('C')

            const handleTokensExpiring = () => {

                console.log('D')

                setTimeout(() => {
                    console.log('A')
                    if(!keycloak.authenticated){
                        dispatch(logout())
                    }
                    console.log('B')
                    KeycloakService.getAccessTokenOnRefreshToken(keycloak.refresh_token as string)
                    .then((response) => {
                        const data = response.data
                        const accessToken = data.access_token
                        const accessTokenExpiresIn = data.expires_in
                        const refreshToken = data.refresh_token
                        const refreshTokenExpiresIn = data.refresh_expires_in
                        dispatch(setAccessToken({token: accessToken, expires_in: accessTokenExpiresIn}))
                        dispatch(setRefreshToken({token: refreshToken, expires_in: refreshTokenExpiresIn}))
                        handleTokensExpiring()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                }, accessTokenExpiresIn*1000)

                setTimeout(() => {
                    dispatch(logout())
                }, refreshTokenExpiresIn*1000)
            }

            handleTokensExpiring()
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <React.Fragment>
            <XCloeasableDialog 
                title="Logowanie"
                form = {
                    <Grid 
                        container 
                        spacing={2}
                        direction="column"
                        alignItems="center"
                    >
                        <div >{keycloak.authenticated}</div>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="login-email" 
                                    placeholder="Login lub E-mail"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, username_email: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="password" 
                                    placeholder="Hasło"
                                    color="secondary"
                                    type="password"
                                    onChange={(event: any) => setForm({...form, password: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                            >
                                Zaloguj
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        </React.Fragment>
    );
}

export default Login;