import { Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {

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
            </Toolbar>
        </nav>
    )
}

export default NavBar;