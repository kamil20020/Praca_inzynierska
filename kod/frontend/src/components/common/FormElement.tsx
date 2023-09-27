import { Grid, Typography, OutlinedInput } from "@mui/material";

interface FormElementProps {
    fieldName: string,
    value: string,
    onChange: (event: any) => void
}

const FormElement = (props: FormElementProps) => {
    return (
        <Grid item xs={12} container alignItems="center">
            <Grid item xs={6}>
                <Typography 
                    textAlign="start" 
                    variant="h6"
                >
                    {props.fieldName}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <OutlinedInput
                    fullWidth
                    color="secondary"
                    value={props.value}
                    onChange={props.onChange}
                />
            </Grid>
        </Grid>
    )
}

export default FormElement;