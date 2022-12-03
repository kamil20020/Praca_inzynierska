import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import UserDetails from "./user-details/UserDetails";
import Roles from "./roles/Roles";
import KeycloakService, { roles } from "../../keycloak/KeycloakService";

export interface ManageUserChildProps {
    userAccountId: string
}

const ManageUser = () => {

    const params = useParams()
    const userAccountId = params.userAccountId as string
    const userId = params.userId as unknown as number

    const [actualRoles, setActualRoles] = React.useState<string[]>([])

    const loadUserRoles = () => {
        KeycloakService.getUserAccountRoles(userAccountId)
        .then((response: any) => {
            setActualRoles(response.data.map((r: any) => r.name))
        })
    }

    useEffect(() => {
        loadUserRoles()
    }, [])

    return (
        <React.Fragment>
            <Grid item xs={12} container alignItems="stretch" justifyContent="center">
                <UserDetails userAccountId={userAccountId}/>
            </Grid>
            <Grid 
                item 
                xs={8} 
                container 
                alignItems="center" 
                justifyContent={"center"} 
                sx={{marginTop: 6}}
            >
                <Roles actualRoles={actualRoles} loadUserRoles={loadUserRoles} userId={userId} userAccountId={userAccountId}/>
            </Grid>
        </React.Fragment>
    );
}

export default ManageUser;