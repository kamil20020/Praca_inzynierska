import { Avatar } from "@mui/material";
import React, { useEffect } from "react";

export interface ImageProps {
    img: any,
    alt?: string
}

const CustomImage = (props: ImageProps) => {
    const [imgStr, setImgStr] = React.useState<string>('');

    const loadImg = () => {

        if(!props.img)
            return

        setImgStr(props.img);
    }

    useEffect(() => {
        loadImg()
    }, [props])

    return (
        <img alt="" src={`data:image/jpeg;base64,${imgStr}`}/>
    );
}

export default CustomImage;

