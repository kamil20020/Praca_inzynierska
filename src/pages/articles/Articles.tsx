import { Grid, Typography } from "@mui/material";
import React from "react";

const Articles = () => {
    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Typography textAlign="center" variant="h4">
                Artykuły
            </Typography>
        </Grid>
    );
}

export default Articles;