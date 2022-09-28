import { Button, FormControl, FormHelperText, Grid, OutlinedInput, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import KeycloakService from "../../../keycloak/KeycloakService";
import User from "../../../models/User";
import UserAPIService from "../../../services/UserAPIService";
import { ManageUserChildProps } from "../ManageUser";
import EditMode from "./EditMode";
import NonEditMode from "./NonEditMode";

export const FormLabel = function(props: any){
    return (
        <Typography textAlign="left" variant="h6">{props.value}</Typography>
    );
}

const UserDetails = (props: ManageUserChildProps) => {

    const userAccountId: string = props.userAccountId

    const [editMode, setEditMode] = React.useState<boolean>(false);

    const [user, setUser] = React.useState<User | null>(null)
    const [username, setUsername] = React.useState<string>('')
    
    useEffect(() => {
        UserAPIService.getUserByUserAccountId(userAccountId)
        .then((response) => {
            setUser(response.data)
        })
        KeycloakService.getUserAccountByUserAccountId(userAccountId)
        .then((response: any) => {
            setUsername(response.data.username)
        })
    }, [editMode])

    return (
        <Grid item xs={8} container alignItems="space-evenly" direction="row" sx={{marginTop: 6}}>
            <Grid item xs={12} container alignItems="center" justifyContent="center" sx={{marginBottom: 6}}>
                <Typography textAlign="center" variant="h4">
                    Dane użytkownika
                </Typography>
            </Grid>
            {!editMode ?
                <NonEditMode user={user as User} username={username} setEditMode={setEditMode}/>
            :
                <EditMode user={user as User} username={username} setEditMode={setEditMode}/>
            }
        </Grid>
    );
}

export default UserDetails;