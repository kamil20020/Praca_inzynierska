import { Grid, Typography } from "@mui/material";
import DatePickerForm from "./DatePickerForm";

export interface DateRangePickerFormProps {
    fieldName: string,
    fromValue?: Date,
    toValue?: Date,
    onFromChange: (newDate: Date | null) => void,
    onToChange: (newDate: Date | null) => void 
}

const DateRangePickerForm = (props: DateRangePickerFormProps) => {
    return (
        <Grid item container justifyContent="space-between" alignItems="center" marginTop={1}>
            <Grid item xs={6}>
                <Typography 
                    textAlign="start" 
                    variant="h6"
                >
                    {props.fieldName}
                </Typography>
            </Grid>
            <Grid item xs={6} container spacing={1}>
                <Grid item xs={6}>
                    <DatePickerForm 
                        fieldName="Od"
                        value={props.fromValue}
                        maxDate={props.toValue}
                        onChange={props.onFromChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePickerForm 
                        fieldName="Do"
                        value={props.toValue}
                        minDate={props.fromValue}
                        onChange={props.onToChange}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default DateRangePickerForm;