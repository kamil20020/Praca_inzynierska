import { Avatar } from "@mui/material";
import React, { useEffect } from "react";

const CustomAvatar = (file: any) => {
    const [img, setImg] = React.useState<any>('');

    const loadImg = () => {

        if(!file.file)
            return

        setImg(file.file);
    }

    useEffect(() => {
        loadImg()
    }, [file])

    return (
        <Avatar alt="Avatar" src={`data:image/jpeg;base64,${img}`}/>
    );
}

export default CustomAvatar;

