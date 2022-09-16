import { Alert, AlertColor, Avatar, Button, FormControl, FormHelperText, Grid, OutlinedInput, Snackbar, TextField, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import XCloeasableDialog from "../../common/XCloeasableDialog";
import CustomAvatar from "../../common/CustomAvatar";
import KeycloakService from "../../../keycloak/KeycloakService";
import { setNotificationMessage, setNotificationStatus } from "../../../redux/slices/notificationSlice";

interface FormFields {
    username: string,
    nickname: string,
    firstname: string,
    surname: string,
    email: string,
    password: string,
    repeatedPassword: string,
    avatar?: File | null
};

const Register = () => {

    const [form, setForm] = React.useState<FormFields>({
        username: '',
        nickname: '',
        firstname: '',
        surname: '',
        email: '',
        password: '',
        repeatedPassword: '',
        avatar: null
    })

    const [close, setClose] = React.useState<boolean>(false)

    const dispatch = useDispatch()

    const handleSubmit = () => {

        KeycloakService.register({})
        .then(() => {
            dispatch(setNotificationMessage('Zarejestrowano pomyślnie'))
            dispatch(setNotificationStatus(true))
            setClose(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <React.Fragment>
            <XCloeasableDialog 
                title="Rejestracja"
                close = {close}
                form = {
                    <Grid 
                        container 
                        spacing={1}
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="username" 
                                    placeholder="Nazwa użytkownika"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, username: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="nickname" 
                                    placeholder="Pseudonim"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, nickname: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="firstname" 
                                    placeholder="Imię"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, firstname: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="surname" 
                                    placeholder="Nazwisko"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, surname: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="email" 
                                    placeholder="E-mail"
                                    type="email"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, email: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="password" 
                                    placeholder="Hasło"
                                    type="password"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, password: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="password1" 
                                    placeholder="Powtórz hasło"
                                    type="password"
                                    color="secondary"
                                    onChange={(event: any) => setForm({...form, repeatedPassword: event.target.value})} 
                                />
                                <FormHelperText> </FormHelperText>
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
                                        onChange={(event: any) => setForm({...form, avatar: event.target.files[0]})} 
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
                    </Grid>
                }
            />
        </React.Fragment>
    );
}

export default Register;