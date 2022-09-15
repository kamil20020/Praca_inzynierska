import { Button, FormControl, FormHelperText, Grid, Input, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import keycloak from "../../../keycloak/Keycloak";
import KeycloakService from "../../../keycloak/KeycloakService";
import { setAccessToken, setRefreshToken } from "../../../redux/slices/keycloakSlice";
import { RootState } from "../../../redux/store";
import XCloeasableDialog from "../../common/XCloeasableDialog";

interface FormFields {
    username_email: string,
    password: string
}

const Login = () => {

    const keycloak = useSelector((state: RootState) => state.keycloak)
    const keycloakDispatch = useDispatch()

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
            keycloakDispatch(setAccessToken({token: accessToken, expires_in: accessTokenExpiresIn}))
            keycloakDispatch(setRefreshToken({token: refreshToken, expires_in: refreshTokenExpiresIn}))
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