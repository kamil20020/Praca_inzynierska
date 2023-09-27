import { Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserInaccessibility from "../../../../models/dto/UserInaccessibility";
import { RootState } from "../../../../redux/store";
import UserInaccessibilityAPIService from "../../../../services/UserInaccessibilityAPIService";
import CircleIcon from '@mui/icons-material/Circle';
import React from "react";
import { error } from "console";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../../redux/slices/notificationSlice";
import CreateUserInaccessibilityView from "./CreateUserInaccessibilityView";

const UserAvialibility = () => {

    const userId = useSelector((state: RootState) => state.user).user.id

    const [userInaccessibility, setUserInaccessibility] = useState<UserInaccessibility | false>(false);
    const [openSetInaccessibility, setOpenSetInaccessibility] = useState<boolean>(false)
    const dispatch = useDispatch()

    useEffect(() => {
        UserInaccessibilityAPIService.getUserInaccessibilityByUserId(userId)
        .then((response) => {
            if(response.status == 204){
                setUserInaccessibility(false)
            }
            else{
                setUserInaccessibility(response.data)
            }
        })
    }, [])

    const handleChangeAvialibility = () => {

        if(userInaccessibility){
            UserInaccessibilityAPIService.removeUserInaccessibilityById(userInaccessibility.id)
            .then(() => {
                setUserInaccessibility(false)
            })
            .catch((error) => {
                dispatch(setNotificationMessage(error.message))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            })
        }
        else{
            if(!openSetInaccessibility){
                setOpenSetInaccessibility(true)
            }
        }
    }

    return (
        <Grid container onClick={handleChangeAvialibility}>
            <CircleIcon sx={{marginRight: 2}} color={userInaccessibility ? "error" : "success"}/>
            <Typography>{userInaccessibility ? "Nieobecny" : "Obecny"}</Typography>
            <CreateUserInaccessibilityView 
                open={openSetInaccessibility} 
                setOpen={(value: boolean) => setOpenSetInaccessibility(value)}
                onAccept={(userInaccessibility: UserInaccessibility) => setUserInaccessibility(userInaccessibility)}
            />
        </Grid>
    );
}

export default UserAvialibility;