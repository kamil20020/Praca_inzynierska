import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import React from "react";
import XCloeasableDialog from "./XCloeasableDialog";

export interface ConfirmationDialogProps {
    buttonTitle: string,
    title: string,
    onAccept: () => void,
    onCancel: () => void
}

const ConfirmationDialog = (props: ConfirmationDialogProps) => {



    return (
        <XCloeasableDialog
            buttonTitle={props.buttonTitle}
            title={props.title} 
            form={undefined}    
        />
    );
}

export default ConfirmationDialog;