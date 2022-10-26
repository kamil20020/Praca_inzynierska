import { LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from "@mui/material";
import React from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormElement from "./FormElement";

export interface DatePickerFormProps {
    fieldName: string,
    value?: Date,
    minDate?: Date,
    maxDate?: Date,
    onChange: (newDate: Date | null) => void
}

const DatePickerForm = (props: DatePickerFormProps) => {
    
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label={props.fieldName}
                value={props.value === undefined ? null : props.value}
                minDate={props.minDate}
                maxDate={props.maxDate}
                onChange={(newValue: Date | null) => props.onChange(newValue)}
                renderInput={(params: any) => (
                    <TextField 
                        {...params}
                        color="secondary"
                    />
                )}
            />
        </LocalizationProvider>
    );
}

export default DatePickerForm;