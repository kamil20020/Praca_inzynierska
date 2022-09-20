import { Grid, FormControl, OutlinedInput, FormHelperText, Button, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FormLabel } from "./UserDetails";
import SaveIcon from '@mui/icons-material/Save';
import KeycloakService from "../../keycloak/KeycloakService";

interface FormFields {
    firstname: string,
    surname: string,
    username: string,
    nickname: string,
    email: string,
    avatar?: string,
};

const EditMode = (props: any) => {

    const accessToken = useSelector((state: RootState) => state.keycloak).access_token as string
    const user = useSelector((state: RootState) => state.user).user

    const [form, setForm] = React.useState<FormFields>({
        firstname: user.firstname,
        surname: user.surname,
        username: KeycloakService.getUsernameFormAccessToken(accessToken),
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
    })

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

    return(
        <Grid item xs={12} container justifyContent="center">
            <Grid item container>
                <Grid item xs={6} container>
                    <Grid item xs={12} container alignItems="center">
                        <Grid item xs={6}>
                            <FormLabel value="Imię"/>
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                            <FormLabel value="Pseudonim"/>
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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