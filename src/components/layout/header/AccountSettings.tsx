import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/keycloakSlice";
import { setNotificationMessage, setNotificationStatus } from "../../../redux/slices/notificationSlice";

const AccountSettings = () => {

    const dispatch = useDispatch()

    const [anchorElUserSettings, setAnchorElUserSettings] = React.useState<null | HTMLElement>(null);

    const handleOpenUserSettings = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUserSettings(event.currentTarget)
    }

    const handleCloseUseSettings = () => {
        setAnchorElUserSettings(null)
    }

    const handleLogout = () => {
        dispatch(logout())
        
        dispatch(setNotificationMessage('Wylogowano pomyślnie'))
        dispatch(setNotificationStatus(true))
    }

    return (
        <React.Fragment>
            <Stack direction="row" alignItems="center">
                <Typography sx={{mr: 2}}>
                    Kamil Dywan
                </Typography>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserSettings}>
                        <Avatar alt="Avatar"/>
                    </IconButton>
                </Tooltip>
            </Stack>
            
            <Menu
                anchorEl={anchorElUserSettings}
                open={Boolean(anchorElUserSettings)}
                onClose={handleCloseUseSettings}
            >
                <MenuItem>Dane użytkownika</MenuItem>
                <MenuItem>Zmień hasło</MenuItem>
                <MenuItem
                    onClick={handleLogout}
                >
                    Wyloguj się
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default AccountSettings;