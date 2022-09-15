import { Button, FormControl, FormHelperText, Grid, OutlinedInput, TextField } from "@mui/material";
import React from "react";
import XCloeasableDialog from "../../common/XCloeasableDialog";

const Register = () => {

    const handleSubmit = () => {


    }

    return (
        <React.Fragment>
            <XCloeasableDialog 
                title="Rejestracja"
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
                                    id="firstname" 
                                    placeholder="Imię"
                                    color="secondary"
                                    onChange={(event: any) => console.log(event.target.value)} 
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
                                    onChange={(event: any) => console.log(event.target.value)} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl>
                                <OutlinedInput 
                                    id="username" 
                                    placeholder="Nazwa użytkownika"
                                    color="secondary"
                                    onChange={(event: any) => console.log(event.target.value)} 
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
                                    onChange={(event: any) => console.log(event.target.value)} 
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
                                    onChange={(event: any) => console.log(event.target.value)} 
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
                                    onChange={(event: any) => console.log(event.target.value)} 
                                />
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Button 
                                variant="contained" 
                                component="label"
                                color="primary"
                            >
                                Dodaj awatar +
                                <input hidden accept="image/*" type="file" />
                            </Button>
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