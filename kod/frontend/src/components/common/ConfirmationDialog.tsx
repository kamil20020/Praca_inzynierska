import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from "@mui/material";
import React, { useEffect } from "react";
import XCloeasableDialog from "./XCloeasableDialog";

export interface ConfirmationDialogProps {
    buttonTitle?: string,
    showButton?: boolean,
    title: string,
    open?: boolean,
    onAccept: () => void,
    onCancel: () => void
}

const ConfirmationDialog = (props: ConfirmationDialogProps) => {

    const [open, setOpen] = React.useState<boolean>(props.open ? props.open : false);

    useEffect(() => {
        setOpen(props.open as boolean)
    }, [props.open])

    const handleAccept = () => {
        props.onAccept()
        setOpen(false)
    }

    const handleCancel = () => {
        props.onCancel()
        setOpen(false)
    }

    return (
        <XCloeasableDialog
            buttonTitle={props.buttonTitle}
            open={open}
            setOpen={setOpen}
            showButton={props.showButton}
            onCancel={handleCancel}
            title={props.title} 
            form={
                <Grid container justifyContent="center" spacing={4}>
                    <Grid item xs={2.5} marginTop={1.2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleAccept}
                        >
                            Akceptuj
                        </Button>
                    </Grid>
                    <Grid item xs={2.5} marginTop={1.2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleCancel}
                        >
                            Anuluj
                        </Button>
                    </Grid>
                </Grid>
            }    
        />
    );
}

export default ConfirmationDialog;