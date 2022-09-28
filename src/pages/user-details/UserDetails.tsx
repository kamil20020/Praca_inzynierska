import { Button, FormControl, FormHelperText, Grid, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomAvatar from "../../components/common/CustomAvatar";
import User from "../../models/User";
import { RootState } from "../../redux/store";
import EditMode from "./EditMode";
import NonEditMode from "./NonEditMode";

export const FormLabel = function(props: any){
    return (
        <Typography textAlign="left" variant="h6">{props.value}</Typography>
    );
}

const UserDetails = () => {

    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <Grid item xs={8} container alignItems="space-evenly" direction="row">
            <Grid item xs={12} container alignItems="center" justifyContent="center" sx={{marginBottom: 6}}>
                <Typography textAlign="center" variant="h4">
                    Dane użytkownika
                </Typography>
            </Grid>
            {!editMode ?
                <NonEditMode setEditMode={setEditMode}/>
            :
                <EditMode setEditMode={setEditMode}/>
            }
        </Grid>
    );
}

export default UserDetails;