import React from "react";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import UserDetails from "./user-details/UserDetails";
import Roles from "./roles/Roles";
import ReviewerTechnologies from "./reviewer-technologies/ReviewerTechnologies";

export interface ManageUserChildProps {
    userAccountId: string
}

const ManageUser = () => {

    const userAccountId = useParams().id as string

    return (
        <React.Fragment>
            <Grid item xs={12} container alignItems="stretch" justifyContent="center">
                <UserDetails userAccountId={userAccountId}/>
            </Grid>
            <Grid item xs={8} container alignItems="center" justifyContent="space-between" sx={{marginTop: 6}}>
                <Roles userAccountId={userAccountId}/>
                <ReviewerTechnologies userAccountId={userAccountId}/>
            </Grid>
        </React.Fragment>
    );
}

export default ManageUser;