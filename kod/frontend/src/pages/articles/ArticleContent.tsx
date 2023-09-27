import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-c.js"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-css"
import "prismjs/components/prism-fsharp"
import "prismjs/components/prism-java"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-python"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-typescript"
import { Typography } from "@mui/material";
import parse from 'html-react-parser';
import { useEffect } from "react";
import Article from "../../models/dto/Article";


export const ArticleContent = (props: {article: Article}) => {

    useEffect(() => {
        Prism.highlightAll();
    }, [])

    return (
        <Typography textAlign="start" variant="h6">
            {parse(props.article.content)}    
        </Typography>
    )
}