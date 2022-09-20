import { Button, FormControl, FormHelperText, Grid, Hidden, Input, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import KeycloakService from "../../../keycloak/KeycloakService";
import { keycloakSlice, logout, setAccessToken, setRefreshToken } from "../../../redux/slices/keycloakSlice";
import { setNotificationMessage, setNotificationStatus, setNotificationType } from "../../../redux/slices/notificationSlice";
import { setRoles, setUser } from "../../../redux/slices/userSlice";
import { RootState, store } from "../../../redux/store";
import FormValidator from "../../../services/FormValidator";
import UserAPIService from "../../../services/UserAPIService";
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

    const [errors, setErrors] = React.useState<FormFields>({
        username_email: '',
        password: ''
    })

    const validateForm = () => {

        let success = true

        let newErrorsState = {...errors}

        if(!FormValidator.checkIfIsRequired(form.username_email)){
            newErrorsState.username_email = FormValidator.requiredMessage
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
            console.log(error)
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
                                value={form.username_email}
                                error={errors.username_email != ''}
                                onChange={(event: any) => onFieldChange('username_email', event)} 
                            />
                            <FormHelperText error>{errors.username_email + ' '}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <OutlinedInput 
                                id="password" 
                                placeholder="Hasło"
                                color="secondary"
                                type="password"
                                value={form.password}
                                error={errors.password != ''}
                                onChange={(event: any) => onFieldChange('password', event)} 
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