import { Grid, Typography } from "@mui/material"

const Loading = () => {
    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Typography textAlign="center" variant="h4">
                Ładowanie strony...
            </Typography>
        </Grid>
    )
}

export default Loading;