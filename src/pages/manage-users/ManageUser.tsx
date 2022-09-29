import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import UserDetails from "./user-details/UserDetails";
import Roles from "./roles/Roles";
import ReviewerTechnologies from "./reviewer-technologies/ReviewerTechnologies";
import KeycloakService, { roles } from "../../keycloak/KeycloakService";

export interface ManageUserChildProps {
    userAccountId: string
}

const ManageUser = () => {

    const userAccountId = useParams().id as string

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
                justifyContent={actualRoles.includes(roles.reviewer.name) ? "space-between" : "center"} 
                sx={{marginTop: 6}}
            >
                <Roles actualRoles={actualRoles} loadUserRoles={loadUserRoles} userAccountId={userAccountId}/>
                {actualRoles.includes(roles.reviewer.name) ?
                    <ReviewerTechnologies userAccountId={userAccountId}/>
                : null
                }
            </Grid>
        </React.Fragment>
    );
}

export default ManageUser;