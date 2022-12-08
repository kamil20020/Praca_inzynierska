import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/slices/keycloakSlice";
import { setUser } from "../../../../redux/slices/userSlice"
import { setNotificationMessage, setNotificationStatus } from "../../../../redux/slices/notificationSlice";
import { RootState } from "../../../../redux/store";
import CustomAvatar from "../../../common/CustomAvatar";
import { roles } from "../../../../keycloak/KeycloakService";
import UserAvialibility from "./UserAvialibility";
import ChangePassword from "./ChangePassword";

const AccountSettings = () => {

    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.user).user
    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const dispatch = useDispatch()

    const [anchorElUserSettings, setAnchorElUserSettings] = React.useState<null | HTMLElement>(null);

    const [showChangePassword, setShowChangePassword] = React.useState<boolean>(false)

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

    const handleChangePassword = () => {
        handleCloseUseSettings()
        setShowChangePassword(true);
    }

    const handleLogout = () => {
        handleCloseUseSettings()
        dispatch(logout())
        dispatch(setUser({}))
        
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
                <Tooltip title="Opcje konta">
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
                {actualRoles.includes(roles.reviewer.name) &&
                    <MenuItem><UserAvialibility/></MenuItem>
                }
                <MenuItem onClick={handleUserDetails}>Dane użytkownika</MenuItem>
                <MenuItem onClick={handleChangePassword}>Zmień hasło</MenuItem>
                <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
            </Menu>
            <ChangePassword open={showChangePassword} onClose={() => setShowChangePassword(false)}/>
        </React.Fragment>
    );
}

export default AccountSettings;