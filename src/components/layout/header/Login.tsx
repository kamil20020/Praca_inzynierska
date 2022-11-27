import { Label } from "@mui/icons-material";
import { Button, FormControl, FormControlLabel, FormHelperText, Grid, Hidden, Input, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import KeycloakService from "../../../keycloak/KeycloakService";
import { keycloakSlice, logout, setAccessToken, setRefreshToken, setRoles, setUsername } from "../../../redux/slices/keycloakSlice";
import { setNotificationMessage, setNotificationStatus, setNotificationType } from "../../../redux/slices/notificationSlice";
import { setUser } from "../../../redux/slices/userSlice";
import { RootState, store } from "../../../redux/store";
import FormValidator from "../../../services/FormValidator";
import UserAPIService from "../../../services/UserAPIService";
import XCloeasableDialog from "../../common/XCloeasableDialog";

interface FormFields {
    username: string,
    password: string
}

const Login = () => {

    const keycloak = useSelector((state: RootState) => state.keycloak)
    const dispatch = useDispatch()

    const [form, setForm] = React.useState<FormFields>({
        username: '',
        password: ''
    })

    const [errors, setErrors] = React.useState<FormFields>({
        username: '',
        password: ''
    })

    const validateForm = () => {

        let success = true

        let newErrorsState = {...errors}

        if(!FormValidator.checkIfIsRequired(form.username)){
            newErrorsState.username = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.password)){
            newErrorsState.password = FormValidator.requiredMessage
            success = false
        }
        else if(!FormValidator.checkMinLength(form.password, 8)){
            newErrorsState.password = FormValidator.minLengthMessage
            success = false
        }
        else if(!FormValidator.checkContainsSmallLetter(form.password)){
            newErrorsState.password = FormValidator.smallLetterMessage
            success = false
        }
        else if(!FormValidator.checkContainsUpperLetter(form.password)){
            newErrorsState.password = FormValidator.upperLetterMessage
            success = false
        }
        else if(!FormValidator.checkContainsDigit(form.password)){
            newErrorsState.password = FormValidator.digitMessage
            success = false
        }

        setErrors(newErrorsState)

        return success
    }

    const onFieldChange = (field: string, event: any) => {
        setForm({...form, [field]: event.target.value})
        setErrors({...errors, [field]: ''})
    }

    const handleSubmit = () => {

        if(!validateForm())
            return

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
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))

            const decodedAccessToken = KeycloakService.decodeAccessToken(accessToken)

            dispatch(setRoles(decodedAccessToken.realm_access.roles))
            
            UserAPIService.getUserByUserAccountId(decodedAccessToken.sub)
            .then((response) => {
                dispatch(setUser(response.data))
                dispatch(setUsername(form.username))
            })

            const handleTokensExpiring = () => {

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
            if(error.response.status == 401){
                dispatch(setNotificationMessage('Login/e-mail lub hasło są niepoprawne'))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            }
        })
    }

    return (
        <XCloeasableDialog 
            title="Logowanie"
            showButton={true}
            form = {
                <Grid 
                    container 
                    spacing={2}
                    direction="column"
                    alignItems="center"
                >
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                id="username" 
                                label={form.username !== '' ? 'Nazwa użytkownika' : ''}
                                placeholder="Nazwa użytkownika"
                                color="secondary"
                                value={form.username}
                                error={errors.username != ''}
                                onChange={(event: any) => onFieldChange('username', event)} 
                                InputLabelProps={{
                                    style: { color: errors.username !== '' ? 'red' : '#5CA8EE' },
                                }}
                                sx={{marginTop: 2}}
                            />
                            <FormHelperText error>{errors.username + ' '}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                id="password"
                                type="password"
                                label={form.password !== '' ? 'Hasło' : ''}
                                placeholder="Hasło"
                                color="secondary"
                                value={form.password}
                                error={errors.password != ''}
                                onChange={(event: any) => onFieldChange('password', event)} 
                                InputLabelProps={{
                                    style: { color: errors.password !== '' ? 'red' : '#5CA8EE' },
                                }}
                            />
                            <FormHelperText error>{errors.password + ' '}</FormHelperText>
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
    );
}

export default Login;