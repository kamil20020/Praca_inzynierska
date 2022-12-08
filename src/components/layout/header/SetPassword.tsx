import { Grid, FormControl, TextField, FormHelperText, formControlClasses, Typography, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import KeycloakService from "../../../keycloak/KeycloakService";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import { RootState } from "../../../redux/store";
import FormValidator from "../../../services/FormValidator";
import XCloeasableDialog from "../../common/XCloeasableDialog";

const SetPassword = () => {

    const userAccountId = useSelector((state: RootState) => state.user).user.userAccountId

    const [password, setPassword] = React.useState<string>('')
    const [passwordError, setPasswordError] = React.useState<string>(password)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const validateForm = () => {

        if(!FormValidator.checkIfIsRequired(password)){
            setPasswordError(FormValidator.requiredMessage)
            return false;
        }
        else if(!FormValidator.checkMinLength(password, 8)){
            setPasswordError(FormValidator.minLengthMessage)
            return false;
        }
        else if(!FormValidator.checkContainsSmallLetter(password)){
            setPasswordError(FormValidator.smallLetterMessage)
            return false;
        }
        else if(!FormValidator.checkContainsUpperLetter(password)){
            setPasswordError(FormValidator.upperLetterMessage)
            return false;
        }
        else if(!FormValidator.checkContainsDigit(password)){
            setPasswordError(FormValidator.digitMessage)
            return false;
        }

        return true
    }

    const handleSubmit = () => {

        if(!validateForm())
            return

        KeycloakService.updateUserAccount(userAccountId, {password: password})
        .then((response) => {
            dispatch(setNotificationMessage('Zapisano hasło'))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            navigate('/')
        })
        .catch((error) => {
            if(error.response.status == 401){
                dispatch(setNotificationMessage('Podano niepoprawne hasło'))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            }
        })
    }

    return (
        <Grid
            item
            container
            rowSpacing={4}
            direction="column"
            alignItems="center"
        >
            <Grid item marginBottom={6}>
                <Typography variant="h4">
                    Ustawianie hasła
                </Typography>
            </Grid>
            <Grid item container justifyContent="center">
                <Grid item xs={2} container justifyContent="center" alignItems="center" marginBottom={3}>
                    <Typography variant="h5">
                        Hasło
                    </Typography>
                </Grid>
                <Grid item xs={2} container justifyContent="center">
                    <FormControl>
                        <TextField
                            id="password"
                            type="password"
                            label={password !== '' ? 'Hasło' : ''}
                            color="secondary"
                            value={password}
                            error={passwordError != ''}
                            onChange={(event: any) => {
                                setPassword(event.target.value)
                                setPasswordError('')
                            }} 
                            InputLabelProps={{
                                style: { color: passwordError !== '' ? 'red' : '#5CA8EE' },
                            }}
                        />
                        <FormHelperText error>{passwordError + ' '}</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item container justifyContent="center" marginTop={2}>
                <Grid item xs={1}>
                    <Button fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                    >
                        Zapisz
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SetPassword;