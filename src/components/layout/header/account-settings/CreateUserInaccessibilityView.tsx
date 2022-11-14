import { TreeView } from "@mui/lab";
import { Button, FormControl, FormHelperText, Grid } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserInaccessibility from "../../../../models/dto/UserInaccessibility";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../../redux/slices/notificationSlice";
import { RootState } from "../../../../redux/store";
import FormValidator from "../../../../services/FormValidator";
import UserInaccessibilityAPIService, { CreateUserInaccessibility } from "../../../../services/UserInaccessibilityAPIService";
import DatePickerForm from "../../../common/DatePickerForm";
import { NodeData } from "../../../common/TreeView";
import XCloeasableDialog from "../../../common/XCloeasableDialog";

export interface CreateUserInaccessibilityViewProps {
    open: boolean, 
    setOpen: (value: boolean) => void, 
    onAccept: (userInaccessibility: UserInaccessibility) => void
}

const CreateUserInaccessibilityView = (props: CreateUserInaccessibilityViewProps) => {

    const userId = useSelector((state: RootState) => state.user).user.id
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [error, setError] = useState<string>('')
    const dispatch = useDispatch()

    const handleCreate = () => {

        if(date == null){
            setError(FormValidator.requiredMessage)
            return;
        }

        if(!FormValidator.checkDate(date.toString())){
            setError(FormValidator.dateMessage)
            return;
        }

        const body: CreateUserInaccessibility = {
            userId: userId,
            toDate: date
        }

        UserInaccessibilityAPIService.createUserInaccessibility(body)
        .then((response) => {
            props.onAccept(response.data)
            props.setOpen(false)
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.message))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    return (
        <XCloeasableDialog
            title="Ustawienie nieobecności"
            size="sm"
            open={props.open}
            setOpen={props.setOpen}
            onCancel={() => props.setOpen(false)}
            form = {
                <Grid container flexDirection="column" alignItems="center" marginTop={2}>
                    <Grid item xs={6} marginBottom={1}>
                        <FormControl>
                            <DatePickerForm 
                                fieldName="Do dnia"
                                value={date}
                                error={error !== ''}
                                minDate={new Date()}
                                onChange={(date: Date | null) => {
                                    setError('')
                                    setDate(date as Date)
                                }}
                            />
                            <FormHelperText error>{error + ' '}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCreate}
                    >
                        Zapisz
                    </Button>
                </Grid>
            }
        />
    );
}

export default CreateUserInaccessibilityView;