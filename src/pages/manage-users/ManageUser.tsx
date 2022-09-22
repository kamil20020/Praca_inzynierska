import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import UserDetails from "./user-details/UserDetails";

const ManageUser = () => {

    const userAccountId = useParams().id as string

    return (
        <Grid item xs={12} container alignItems="stretch" justifyContent="center">
            <UserDetails userAccountId={userAccountId}/>
        </Grid>
    );
}

export default ManageUser;