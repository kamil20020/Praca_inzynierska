import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import KeycloakService from "../../../keycloak/KeycloakService";
import { RootState } from "../../../redux/store";
import { Role } from "../../../keycloak/KeycloakService";
import { ManageUserChildProps } from "../ManageUser";

const Roles = (props: ManageUserChildProps) => {

    const userAccountId: string = props.userAccountId

    const [roles, setRoles] = React.useState<string[]>([])

    useEffect(() => {
        KeycloakService.getUserAccountRoles(userAccountId)
        .then((response) => {
            setRoles(response as string[])
        })
    }, [])

    const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {

        const choice = event.target.value
        const checked = event.target.checked

        let roles: Role[] = []

        if(choice === "admin" ){
            roles = [{
                id: "db417da8-5df0-49aa-aa2a-878ef45fb343",
                name: "admin"
            }]
        }
        else{
            roles = [{
                id: "c59b2c5e-c209-4e66-8c07-d4a5a0625552",
                name: "reviewer"
            }]
        }
            
        if(checked){
            KeycloakService.addRoleToUser(userAccountId, roles)
        }
        else{
            KeycloakService.removeRoleFromUser(userAccountId, roles)
        }
    }

    return (
        <React.Fragment>
            <Grid item xs={5.5} container alignItems="stretch" justifyContent="start" direction="column">
                <Grid item xs={12}>
                    <Typography textAlign="center" variant="h5" sx={{marginBottom: 5}}>
                        Role użytkownika
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Paper variant="outlined" sx={{display: 'flex', justifyContent: 'center', paddingTop: 2, paddingBottom: 2}}>
                        <Grid item xs={5} container alignItems="center" justifyContent="center">
                            <Grid item xs={6} container justifyContent="start">
                                <Typography textAlign="center" variant="h6">
                                    Administrator
                                </Typography>
                            </Grid>
                            <Grid item xs={6} container justifyContent="end">
                                <Checkbox
                                    value="admin"
                                    color="secondary" 
                                    onChange={(event: any) => handleChangeRole(event)}
                                />
                            </Grid>
                            <Grid item xs={6} container justifyContent="start">
                                <Typography textAlign="center" variant="h6">
                                    Recenzent
                                </Typography>
                            </Grid>
                            <Grid item xs={6} container justifyContent="end">
                                <Checkbox
                                    value="reviewer"
                                    color="secondary" 
                                    onChange={(event: any) => handleChangeRole(event)}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Roles;