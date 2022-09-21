import { Grid, FormControl, OutlinedInput, FormHelperText, Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FormLabel } from "./UserDetails";
import SaveIcon from '@mui/icons-material/Save';
import KeycloakService, { Credentials, UpdateCredentials } from "../../keycloak/KeycloakService";
import FormValidator from "../../services/FormValidator";
import UserAPIService, { UpdateUserModel } from "../../services/UserAPIService";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import { setUser } from "../../redux/slices/userSlice";
import { setAccessToken, setRefreshToken, logout, setUsername } from "../../redux/slices/keycloakSlice";

interface FormFields {
    firstname: string,
    surname: string,
    username: string,
    nickname: string,
    email: string,
    avatar?: string
};

const EditMode = (props: any) => {

    const user = useSelector((state: RootState) => state.user).user
    const keycloak = useSelector((state: RootState) => state.keycloak)
    const username = keycloak.username

    const dispatch = useDispatch()

    const initialForm = {
        firstname: user.firstname,
        surname: user.surname,
        username: username,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
    }

    const [form, setForm] = React.useState<FormFields>(initialForm)

    const [errors, setErrors] = React.useState<FormFields>({
        firstname: '',
        surname: '',
        username: '',
        email: '',
        nickname: ''
    })

    const onFieldChange = (field: string, event: any) => {
        setForm({...form, [field]: event.target.value})
        setErrors({...errors, [field]: ''})
    }

    const handleChangeAvatar = (event: any) => {

        let file = event.target.files[0]

        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
        .then((file) => {
            console.log(file)
            file = (file as string).split(',')[1]
            setForm({...form, avatar: file as string})
        })
    }

    const validateForm = () => {

        let success = true

        let newErrorsState = {...errors}

        if(!FormValidator.checkIfIsRequired(form.username)){
            newErrorsState.username = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.nickname)){
            newErrorsState.nickname = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.firstname)){
            newErrorsState.firstname = FormValidator.requiredMessage
            success = false
        }
        
        if(!FormValidator.checkIfIsRequired(form.surname)){
            newErrorsState.surname = FormValidator.requiredMessage
            success = false
        }

        if(!FormValidator.checkIfIsRequired(form.email)){
            newErrorsState.email = FormValidator.requiredMessage
            success = false
        }
        else if(!FormValidator.checkEmail(form.email)){
            newErrorsState.email = FormValidator.emailMessage
            success = false
        }

        setErrors(newErrorsState)

        return success
    }

    const handleSubmit = () => {

        if(!validateForm())
            return

        const changedCredentials: UpdateCredentials = {
            username: form.username != initialForm.username ? form.username : undefined
        }

        const changedUserData: UpdateUserModel = {
            nickname: form.nickname != initialForm.nickname ? form.nickname : undefined,
            firstname: form.firstname != initialForm.firstname ? form.firstname : undefined,
            surname: form.surname != initialForm.surname ? form.surname : undefined,
            email: form.email != initialForm.email ? form.email : undefined,
            avatar: form.avatar != initialForm.avatar ? form.avatar : undefined
        }

        const updateUser = () => {
            UserAPIService.updateUser(user.id as number, changedUserData)
            .then((response) => {
                const changedUser = response.data
                dispatch(setUser(changedUser))
                dispatch(setNotificationMessage("Zmienione dane zostały zapisane"))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                props.setEditMode(false)
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.message))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }

        if(form.username != initialForm.username){

            KeycloakService.updateUserAccount(user.userAccountId as string, changedCredentials)
            .then((response) => {
                dispatch(setUsername(form.username))
                updateUser()
            })
            .catch((error) => {
                if(error.request.code == 409){
                    dispatch(setNotificationMessage("Istnieje już użytkownik o takiej nazwie użytkownika"))
                    dispatch(setNotificationType('error'))
                    dispatch(setNotificationStatus(true))
                }
            })
        }
        else{
            updateUser()
        }
    }

    return(
        <Grid item xs={12} container justifyContent="center">
            <Grid item container>
                <Grid item xs={6} container spacing={1}>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item xs={6}>
                            <FormLabel value="Imię"/>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl>
                                <OutlinedInput 
                                    id="firstname" 
                                    color="secondary"
                                    value={form.firstname}
                                    error={errors.firstname != ''}
                                    onChange={(event: any) => onFieldChange('firstname', event)} 
                                />
                                <FormHelperText error>{errors.firstname + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item xs={6}>
                            <FormLabel value="Nazwisko"/>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl>
                                <OutlinedInput 
                                    id="surname" 
                                    color="secondary"
                                    value={form.surname}
                                    error={errors.surname != ''}
                                    onChange={(event: any) => onFieldChange('surname', event)} 
                                />
                                <FormHelperText error>{errors.surname + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item xs={6}>
                            <FormLabel value="Nazwa użytkownika"/>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl>
                                <OutlinedInput 
                                    id="username" 
                                    color="secondary"
                                    value={form.username}
                                    error={errors.username != ''}
                                    onChange={(event: any) => onFieldChange('username', event)} 
                                />
                                <FormHelperText error>{errors.username + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item xs={6}>
                            <FormLabel value="Pseudonim"/>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl>
                                <OutlinedInput 
                                    id="nickname" 
                                    color="secondary"
                                    value={form.nickname}
                                    error={errors.nickname != ''}
                                    onChange={(event: any) => onFieldChange('nickname', event)} 
                                />
                                <FormHelperText error>{errors.nickname + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item xs={6}>
                            <FormLabel value="E-mail"/>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl>
                                <OutlinedInput 
                                    id="email" 
                                    color="secondary"
                                    value={form.email}
                                    error={errors.email != ''}
                                    onChange={(event: any) => onFieldChange('email', event)} 
                                />
                                <FormHelperText error>{errors.email + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <Grid item xs={4} container justifyContent="center">
                        <FormLabel value="Avatar"/>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                        <img alt="avatar" src={`data:image/jpeg;base64,${form.avatar}`}/>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                        <Button 
                            variant="contained" 
                            component="label"
                            color="primary"
                        >
                            <Typography sx={{mr: 1}}>Dodaj awatar</Typography>
                            <SaveIcon color="secondary"/>
                            <input 
                                hidden 
                                accept="image/*" 
                                type="file" 
                                onChange={(event: any) => handleChangeAvatar(event)} 
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="center" alignItems="center">
                <Grid item xs={4} container justifyContent="center">
                    <Grid item xs={3} container justifyContent="center">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                        >
                            Zapisz
                        </Button>
                    </Grid>
                    <Grid item xs={3} container justifyContent="center">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => props.setEditMode(false)}
                        >
                            Anuluj
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EditMode;