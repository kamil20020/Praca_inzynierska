import { Button, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../../redux/store";
import "./NavBar.css";

const NavBar = () => {

    const roles = useSelector((state: RootState) => state.keycloak).roles

    return (
        <nav>
            <Toolbar>
                <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1, ml: 2}}>
                    <Link to="/articles" className="nice-link">
                        Artykuły
                    </Link>
                </Typography>
                <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1, ml: 2}}>
                    <Link to="/technologies" className="nice-link">
                        Technologie
                    </Link>
                </Typography>
                {roles.includes('administrator') ?
                    <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1, ml: 2}}>
                        <Link to="/manage-users" className="nice-link">
                            Zarządzanie użytkownikami
                        </Link>
                    </Typography>
                : null
                }
            </Toolbar>
        </nav>
    )
}

export default NavBar;