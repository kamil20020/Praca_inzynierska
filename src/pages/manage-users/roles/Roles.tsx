import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import KeycloakService, { roles } from "../../../keycloak/KeycloakService";
import { RootState } from "../../../redux/store";
import { Role } from "../../../keycloak/KeycloakService";
import { ManageUserChildProps } from "../ManageUser";

export interface RolesProps {
    actualRoles: string[],
    loadUserRoles: () => void,
    userAccountId: string
}

const Roles = (props: RolesProps) => {

    const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {

        const choice = event.target.value
        const checked = event.target.checked

        let toUpdateRole: Role

        if(choice === roles.administrator.name){
            toUpdateRole = roles.administrator
        }
        else{
            toUpdateRole = roles.reviewer
        }
            
        if(checked){
            KeycloakService.addRoleToUser(props.userAccountId, toUpdateRole)
            .then(() => {
                props.loadUserRoles()
            })
        }
        else{
            KeycloakService.removeRoleFromUser(props.userAccountId, toUpdateRole)
            .then(() => {
                props.loadUserRoles()
            })
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
                                    value={roles.administrator.name}
                                    color="secondary"
                                    checked={props.actualRoles.includes(roles.administrator.name)}
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
                                    value={roles.reviewer.name}
                                    color="secondary"
                                    checked={props.actualRoles.includes(roles.reviewer.name)}
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