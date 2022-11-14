import { Avatar, SxProps, Theme } from "@mui/material";
import React, { useEffect } from "react";

const CustomAvatar = (props: {file: any, sx?: SxProps<Theme>}) => {
    const [img, setImg] = React.useState<any>('');

    const loadImg = () => {

        if(!props.file)
            return

        setImg(props.file);
    }

    useEffect(() => {
        loadImg()
    }, [props])

    return (
        <Avatar alt="Avatar" src={`data:image/jpeg;base64,${img}`} sx={{...props.sx}}/>
    );
}

export default CustomAvatar;

