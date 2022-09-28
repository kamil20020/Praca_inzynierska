import { Grid, Button } from "@mui/material";
import { useSelector } from "react-redux";
import User from "../../models/User";
import { RootState } from "../../redux/store";
import { FormLabel } from "./UserDetails";

export interface NonEditModeProps {
    setEditMode: (value: boolean) => void
}

const NonEditMode = (props: NonEditModeProps) => {

    const user = useSelector((state: RootState) => state.user).user
    const username = useSelector((state: RootState) => state.keycloak).username

    return (
        <Grid item xs={12} container justifyContent="center">
            <Grid item container>
                <Grid item xs={6} container spacing={3}>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Imię"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.firstname}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Nazwisko"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.surname}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Nazwa użytkownika"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={username}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Pseudonim"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.nickname}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="E-mail"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.email}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <Grid item xs={6} container justifyContent="center">
                        <FormLabel value="Avatar"/>
                    </Grid>
                    <Grid item xs={6} container justifyContent="center">
                        <img alt="avatar" src={`data:image/jpeg;base64,${user.avatar}`}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="center" alignItems="center" sx={{marginTop: 6}}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => props.setEditMode(true)}
                >
                    Edytuj dane
                </Button>
            </Grid>
        </Grid>
    );
}

export default NonEditMode;