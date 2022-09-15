import { AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png';
import { RootState } from "../../../redux/store";
import AccountSettings from "./AccountSettings";
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
                    <React.Fragment>
                        <Login/>
                        <Register/>
                    </React.Fragment>
                }
            </Box>
        </Toolbar>
    );
}

export default Header;