import { Grid, Typography } from "@mui/material";
import React from "react";
import XCloeasableDialog from "../../components/common/XCloeasableDialog";
import ArticleVerificationAPIService from "../../services/ArticleVerificationAPIService";

const VerificationMessageView = (props: {articleId: string}) => {

    console.log(props.articleId)

    const [verificationMessage, setVerificationMessage] = React.useState<string>('');

    React.useEffect(() => {
        ArticleVerificationAPIService.getByArticleId(props.articleId)
        .then((response) => {
            setVerificationMessage(response.data)
        })
    })

    return (
        <XCloeasableDialog 
            title="Uzasadnienie weryfikacji"
            showButton={true}
                form = {
                    <Typography textAlign="center" variant="h6">
                        {verificationMessage}
                    </Typography>
                }
        />
    )
}

export default VerificationMessageView;