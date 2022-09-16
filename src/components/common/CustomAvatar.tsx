import { Avatar } from "@mui/material";
import React, { useEffect } from "react";

const CustomAvatar = (file: any) => {
    const [img, setImg] = React.useState<any>('');

    const loadImg = () => {

        if(!file.file)
            return

        const reader = new FileReader();
        reader.readAsDataURL(file.file)

        reader.onload = (event) => {
            setImg(event.target?.result);
        }
    }

    useEffect(() => {
        loadImg()
    }, [file])

    return (
        <Avatar alt="Avatar" src={img}/>
    );
}

export default CustomAvatar;

