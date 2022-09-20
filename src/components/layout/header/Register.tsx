import { Alert, AlertColor, Avatar, Button, FormControl, FormControlLabel, FormHelperText, Grid, OutlinedInput, Radio, RadioGroup, Snackbar, TextField, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import XCloeasableDialog from "../../common/XCloeasableDialog";
import CustomAvatar from "../../common/CustomAvatar";
import KeycloakService from "../../../keycloak/KeycloakService";
import { setNotificationMessage, setNotificationStatus, setNotificationType } from "../../../redux/slices/notificationSlice";
import FormValidator from "../../../services/FormValidator";

interface FormFields {
    username: string,
    nickname: string,
    firstname: string,
    surname: string,
    email: string,
    password: string,
    repeatedPassword: string,
    avatar?: string
};

const Register = () => {

    const initialFormState = {
        username: '',
        nickname: '',
        firstname: '',
        surname: '',
        email: '',
        password: '',
        repeatedPassword: '',
        avatar: ''
    }

    const [form, setForm] = React.useState<FormFields>(initialFormState)

    const [errors, setErrors] = React.useState<FormFields>({
        username: '',
        nickname: '',
        firstname: '',
        surname: '',
        email: '',
        password: '',
        repeatedPassword: ''
    })

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

    const [close, setClose] = React.useState<boolean>(false)
    const [openStatute, setOpenStatute] = React.useState<boolean>(false)

    const dispatch = useDispatch()

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

        if(!FormValidator.checkIfIsRequired(form.repeatedPassword)){
            newErrorsState.repeatedPassword = FormValidator.requiredMessage
            success = false
        }
        else if(form.password !== form.repeatedPassword){
            newErrorsState.repeatedPassword = "Hasła nie są identyczne"
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

        console.log('B')

        KeycloakService.checkAccountAndUserCanBeCreated({username: form.username, password: form.password}, form)
        .then(() => {
            setOpenStatute(true)
            console.log('A')
        })
        .catch((error) => {
            console.log(error)
            dispatch(setNotificationMessage(error.message))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    const handleStatuteChoice = (event: React.ChangeEvent<HTMLInputElement>) => {

        const choice = event.target.value

        if(choice === "accept"){
            KeycloakService.register({username: form.username, password: form.password}, form)
            .then(() => {
                dispatch(setNotificationMessage('Pomyślnie utworzono konto'))
                dispatch(setNotificationType('success'))
                dispatch(setNotificationStatus(true))
                setForm(initialFormState)
                setClose(true)
                setOpenStatute(false)
            })
        }
        else{
            setClose(true)
            setOpenStatute(false)
        }
    };

    return (
        <XCloeasableDialog 
            title="Rejestracja"
            close = {close}
            setClose = {setClose}
            form = {
                <Grid 
                    container 
                    spacing={1}
                    direction="column"
                    alignItems="center"
                >
                    {!openStatute ? 
                        <React.Fragment>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="username" 
                                        placeholder="Nazwa użytkownika"
                                        color="secondary"
                                        value={form.username}
                                        error={errors.username != ''}
                                        onChange={(event: any) => onFieldChange('username', event)} 
                                    />
                                    <FormHelperText error>{errors.username + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="nickname" 
                                        placeholder="Pseudonim"
                                        color="secondary"
                                        value={form.nickname}
                                        error={errors.nickname != ''}
                                        onChange={(event: any) => onFieldChange('nickname', event)} 
                                    />
                                    <FormHelperText error>{errors.nickname + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="firstname" 
                                        placeholder="Imię"
                                        color="secondary"
                                        value={form.firstname}
                                        error={errors.firstname != ''}
                                        onChange={(event: any) => onFieldChange('firstname', event)} 
                                    />
                                    <FormHelperText error>{errors.firstname + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="surname" 
                                        placeholder="Nazwisko"
                                        color="secondary"
                                        value={form.surname}
                                        error={errors.surname != ''}
                                        onChange={(event: any) => onFieldChange('surname', event)} 
                                    />
                                    <FormHelperText error>{errors.surname + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="email" 
                                        placeholder="E-mail"
                                        type="email"
                                        color="secondary"
                                        value={form.email}
                                        error={errors.email != ''}
                                        onChange={(event: any) => onFieldChange('email', event)} 
                                    />
                                    <FormHelperText error>{errors.email + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="password" 
                                        placeholder="Hasło"
                                        type="password"
                                        color="secondary"
                                        value={form.password}
                                        error={errors.password != ''}
                                        onChange={(event: any) => onFieldChange('password', event)} 
                                    />
                                    <FormHelperText error>{errors.password + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <OutlinedInput 
                                        id="repeatedPassword" 
                                        placeholder="Powtórz hasło"
                                        type="password"
                                        color="secondary"
                                        value={form.repeatedPassword}
                                        error={errors.repeatedPassword != ''}
                                        onChange={(event: any) => onFieldChange('repeatedPassword', event)} 
                                    />
                                    <FormHelperText error>{errors.repeatedPassword + ' '}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sx={{mb: 3}}>
                                <Stack direction="row" spacing={2}>
                                    <CustomAvatar file={form.avatar}/>
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
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSubmit}
                                >
                                    Zarejestruj
                                </Button>
                            </Grid>          
                        </React.Fragment>
                        : 
                        <Grid item xs={12} container justifyContent="center" spacing={2}>
                            <Grid item xs={11}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Regulamin"
                                    multiline
                                    disabled
                                    fullWidth
                                    rows={20}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                          WebkitTextFillColor: "black",
                                        },
                                      }}
                                    defaultValue="
                                    1. Ogólne zasady

                                    Użytkownicy nie powinni umieszczać w serwisie treści zawierających wulgaryzmy, będących spamem lub zawierających linki do 
                                    niebezpiecznych stron (wirusy itp.). W pierwszym przypadku treści te będą usuwane przez administratorów, a w przypadku 
                                    skrajnych lub powtarzających się takich działań, konto użytkownika odpowiadającego za tego typu treści może zostać 
                                    zablokowane na jakiś czas (zwykle 1 dzień) lub na stałe.
                                    
                                    2. Artykuły
                                    
                                    Użytkownicy nie powinni publikować w artykułach informacji nieprawdziwych, nieaktualnych, tekst nie powinien zawierać błędów,
                                    zamieszczane rysunki powinny być czytelne, a kod powinien być wstawiony za pomocą pól specjalnie do tego przeznaczonych.
                                    W przypadku niezastosowania się użytkownika do powyższych reguł, artykuł zostanie zedytowany przez administratora w przypadku
                                    wymogu drobnych poprawek, a w przypadku dużych zmian, artykuł taki zostanie wycofany z serwisu, autor artykułu będzie
                                    musiał poprawić błędy i zmieniony artykuł przejdzie jeszcze raz weryfikację przez automatycznie wybranego recenzenta.
                                    "
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl>
                                    <RadioGroup name="accept-statute">
                                        <FormControlLabel 
                                            value="accept" 
                                            control={<Radio color="secondary"/>} 
                                            label="Akceptuję regulamin" 
                                            onChange={(event: any) => handleStatuteChoice(event)}
                                        />
                                        <FormControlLabel 
                                            value="refusal" 
                                            control={<Radio color="secondary"/>} 
                                            label="Nie akceptuje regulaminu"
                                            onChange={(event: any) => handleStatuteChoice(event)}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            }
        />
    );
}

export default Register;