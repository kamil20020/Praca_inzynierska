import { AppBar, Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png';
import { RootState } from "../../../redux/store";
import AccountSettings from "./account-settings/AccountSettings";
import './Header.css';
import Login from "./Login";
import Register from "./Register";

const Header = () => {

    const keycloak = useSelector((state: RootState) => state.keycloak);

    return (
        <Toolbar>
            <img src={logo}/>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" sx={{ ml: 2}}>
                    <Link to="/" className="nice-link">
                        Technologie IT
                    </Link>
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
                {keycloak.authenticated ? 
                    <AccountSettings/> 
                    : 
                    <Grid container justifyContent="space-between" marginRight={4}>
                        <Grid item xs={5.65}>
                            <Login/>
                        </Grid>
                        <Grid item xs={5.65}>
                            <Register/>
                        </Grid>
                    </Grid>
                }
            </Box>
        </Toolbar>
    );
}

export default Header;