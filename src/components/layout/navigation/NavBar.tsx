import { Button, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { roles } from "../../../keycloak/KeycloakService";
import { RootState } from "../../../redux/store";
import "./NavBar.css";

const NavBar = () => {

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles

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
                {actualRoles.includes(roles.reviewer.name) ?
                    <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1, ml: 2}}>
                        <Link to="/articles-verification" className="nice-link">
                            Weryfikacja artykułów
                        </Link>
                    </Typography>
                : null
                }
                {actualRoles.includes(roles.administrator.name) ?
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