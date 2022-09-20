import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/keycloakSlice";
import { setNotificationMessage, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import { RootState } from "../../../redux/store";
import CustomAvatar from "../../common/CustomAvatar";

const AccountSettings = () => {

    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.user).user
    const dispatch = useDispatch()

    const [anchorElUserSettings, setAnchorElUserSettings] = React.useState<null | HTMLElement>(null);

    const handleOpenUserSettings = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUserSettings(event.currentTarget)
    }

    const handleCloseUseSettings = () => {
        setAnchorElUserSettings(null)
    }

    const handleUserDetails = () => {
        handleCloseUseSettings()
        navigate('/user-details')
    }

    const handleLogout = () => {
        dispatch(logout())
        
        dispatch(setNotificationMessage('Wylogowano pomyślnie'))
        dispatch(setNotificationStatus(true))

        navigate('/');
    }

    return (
        <React.Fragment>
            <Stack direction="row" alignItems="center">
                <Typography sx={{mr: 2}}>
                    {user.nickname}
                </Typography>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserSettings}>
                        <CustomAvatar file={user.avatar}/>
                    </IconButton>
                </Tooltip>
            </Stack>
            
            <Menu
                anchorEl={anchorElUserSettings}
                open={Boolean(anchorElUserSettings)}
                onClose={handleCloseUseSettings}
            >
                <MenuItem onClick={handleUserDetails}>Dane użytkownika</MenuItem>
                <MenuItem>Zmień hasło</MenuItem>
                <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default AccountSettings;