import { Grid, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const SearchUsers = () => {
    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Typography textAlign="center" variant="h4">
                Wyszukiwanie użytkowników
            </Typography>
            <Link to="user/2" className="nice-link">
                Zarządzanie użytkownikiem
            </Link>
            <Outlet/>
        </Grid>
    );
}

export default SearchUsers;