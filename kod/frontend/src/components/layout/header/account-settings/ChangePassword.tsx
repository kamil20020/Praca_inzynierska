import { Grid, Typography, FormControl, TextField, FormHelperText, Button } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import KeycloakService from "../../../../keycloak/KeycloakService";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../../redux/slices/notificationSlice";
import { RootState } from "../../../../redux/store";
import FormValidator from "../../../../services/FormValidator";
import XCloeasableDialog from "../../../common/XCloeasableDialog";

export interface ChangePasswordProps {
    open: boolean,
    onClose: () => void
}

interface FormProps {
    actualPassword: string,
    newPassword: string
}

const ChangePassword = (props: ChangePasswordProps) => {

    const userAccountId = useSelector((state: RootState) => state.user).user.userAccountId
    const username = useSelector((state: RootState) => state.keycloak).username

    const [form, setForm] = React.useState<FormProps>({
        actualPassword: '',
        newPassword: ''
    })
    const [errors, setErrors] = React.useState<FormProps>(form)

    const dispatch = useDispatch()

    const validateForm = () => {

        let success = true

        let newErrorsState = {...errors}

        if(!FormValidator.checkIfIsRequired(form.actualPassword)){
            newErrorsState.actualPassword = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.newPassword)){
            newErrorsState.newPassword = FormValidator.requiredMessage
            success = false
        }
        else if(!FormValidator.checkMinLength(form.newPassword, 8)){
            newErrorsState.newPassword = FormValidator.minLengthMessage
            success = false
        }
        else if(!FormValidator.checkContainsSmallLetter(form.newPassword)){
            newErrorsState.newPassword = FormValidator.smallLetterMessage
            success = false
        }
        else if(!FormValidator.checkContainsUpperLetter(form.newPassword)){
            newErrorsState.newPassword = FormValidator.upperLetterMessage
            success = false
        }
        else if(!FormValidator.checkContainsDigit(form.newPassword)){
            newErrorsState.newPassword = FormValidator.digitMessage
            success = false
        }

        setErrors(newErrorsState)

        return success
    }

    const handleSubmit = () => {

        if(!validateForm())
            return

        KeycloakService.login({username: username, password: form.actualPassword})
        .then((response) => {
            KeycloakService.updateUserAccount(userAccountId, {password: form.newPassword})
            .then((response) => {
                dispatch(setNotificationMessage('Zmieniono hasło'))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                props.onClose()
            })
            .catch((error) => {
                if(error.response.status == 401){
                    setErrors({...errors, newPassword: 'Niepoprawne hasło'})
                }
            })
        })
        .catch((error) => {
            setErrors({...errors, actualPassword: 'Niepoprawne hasło'})
        })
    }

    const onFieldChange = (field: string, event: any) => {
        setForm({...form, [field]: event.target.value})
        setErrors({...errors, [field]: ''})
    }
    
    return (
        <XCloeasableDialog 
            title="Zmiana hasła"
            open={props.open}
            showButton={false}
            form = {
                <Grid
                    item
                    container
                    rowSpacing={4}
                    direction="column"
                    alignItems="center"
                >
                    <Grid item container justifyContent="center" marginTop={3}>
                        <Grid item xs={4} container alignItems="center" marginBottom={3}>
                            <Typography variant="h6" textAlign="left">
                                Aktualne hasło
                            </Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="end">
                            <FormControl>
                                <TextField
                                    type="password"
                                    label={form.actualPassword !== '' ? 'Hasło' : ''}
                                    color="secondary"
                                    value={form.actualPassword}
                                    error={errors.actualPassword != ''}
                                    onChange={(event: any) => onFieldChange('actualPassword', event)} 
                                    InputLabelProps={{
                                        style: { color: errors.actualPassword !== '' ? 'red' : '#5CA8EE' },
                                    }}
                                />
                                <FormHelperText error>{errors.actualPassword + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent="center">
                        <Grid item xs={4} container alignItems="center" marginBottom={3}>
                            <Typography variant="h6">
                                Nowe hasło
                            </Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="end">
                            <FormControl>
                                <TextField
                                    type="password"
                                    label={form.newPassword !== '' ? 'Hasło' : ''}
                                    color="secondary"
                                    value={form.newPassword}
                                    error={errors.newPassword != ''}
                                    onChange={(event: any) => onFieldChange('newPassword', event)} 
                                    InputLabelProps={{
                                        style: { color: errors.newPassword !== '' ? 'red' : '#5CA8EE' },
                                    }}
                                />
                                <FormHelperText error>{errors.newPassword + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent="center">
                        <Grid item xs={4}>
                            <Button fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                            >
                                Zapisz
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container justifyContent="center">
                        <Grid item xs={4}>
                            <Button fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={props.onClose}
                            >
                                Anuluj
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            }
        />
    );
}

export default ChangePassword;