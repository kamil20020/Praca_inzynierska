import { Breakpoint, Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface XCloeasableDialogProps {
    title: string,
    form: any,
    close?: boolean,
    size?: Breakpoint,
    setClose?: (value: boolean) => void
}

const XCloeasableDialog = (props: XCloeasableDialogProps) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if(props.close)
            setOpen(!props.close)
    }, [props.close])

    const handleOpen = () => {
        setOpen(true)
        if(props.setClose != null){
            props.setClose!(false)
        }
    }

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                sx={{mr: 2}}
            >
                {props.title}
            </Button>
            <Dialog
                title={props.title}
                maxWidth={props.size !== null ? props.size : "xs"}
                fullWidth={true}
                open={open}
                onClose={() => setOpen(false)}
            >
                <IconButton
                    onClick={() => setOpen(false)}
                    style={{ position: "absolute", right: 0 }}
                >
                    <CloseIcon fontSize="large"/>
                </IconButton>
                <DialogTitle textAlign="center" sx={{mt: 4, mb: 2}}>{props.title}</DialogTitle>
                {props.form}
                <div style={{paddingBottom: 50}}></div>
            </Dialog>
        </React.Fragment>
    );
}

export default XCloeasableDialog;