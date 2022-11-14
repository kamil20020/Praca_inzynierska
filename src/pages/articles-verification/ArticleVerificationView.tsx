import { Button, FormControl, FormHelperText, Grid, Rating, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import CustomAvatar from "../../components/common/CustomAvatar";
import CustomImage from "../../components/common/CustomImage";
import Article from "../../models/dto/Article";
import ArticleVerification, { ArticleVerificationStatus } from "../../models/dto/ArticleVerification";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import ArticleAPIService from "../../services/ArticleAPIService";
import ArticleVerificationAPIService from "../../services/ArticleVerificationAPIService";
import FormValidator from "../../services/FormValidator";
import { ArticleContent } from "../articles/ArticleContent";
import { ArticleHeader } from "../articles/ArticleView";

const ArticleVerificationView = () => {

    const articleVerificationId = useParams().articleVerificationId as any as number
    const [article, setArticle] = useState<Article>()
    const [feedback, setFeedback] = useState<string>('')
    const [feedbackError, setFeedbackError] = useState<string>('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        ArticleVerificationAPIService.getById(articleVerificationId)
        .then((response) => {
            const articleVerification: ArticleVerification = response.data
            setArticle(articleVerification.articleDTO)
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }, [])

    if(!article){
        return <div></div>
    }

    const handleChangeFeedback = (newFeedback: string) => {

        setFeedback(newFeedback)
        setFeedbackError('')
    }

    const handleAccept = () => {

        ArticleVerificationAPIService.changeArticleVerificationStatusById(articleVerificationId, ArticleVerificationStatus.ACCEPTED, feedback)
        .then(() => {
            dispatch(setNotificationMessage("Zaakceptowano artykuł"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            navigate('../')
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    const handleReject = () => {

        if(!FormValidator.checkIfIsRequired(feedback)){
            setFeedbackError(FormValidator.requiredMessage)
            return;
        }

        ArticleVerificationAPIService.changeArticleVerificationStatusById(articleVerificationId, ArticleVerificationStatus.REJECTED, feedback)
        .then(() => {
            dispatch(setNotificationMessage("Nie zaakceptowano artykułu"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            navigate('../')
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    return(
        <Grid item xs={12} container alignItems="start" justifyContent="center" marginTop={4}>
            <Grid item xs={12}>
                <Typography textAlign="center" variant="h4" sx={{marginTop: 2, marginBottom: 2}}>
                    Weryfikacja artykułu ,,{article.title}''
                </Typography>
            </Grid>
            <Grid item xs={10.5} container justifyContent="space-between" direction="row">
                <ArticleHeader article={article}/>
            </Grid>
            <Grid item xs={10.5} container spacing={2}>
                <Grid item container justifyContent="center">
                    <CustomImage alt="Ikona technologii" img={article.technologyDTO.icon}/>
                </Grid>
                <Grid item container alignItems="start" direction="column" spacing={2}>
                    {article.technologyDTO.provider &&
                        <Grid item>
                            <Typography textAlign="start" variant="h6">Dostawca: {article.technologyDTO.provider}</Typography>
                        </Grid>
                    }
                    <Grid item>
                        <Typography textAlign="start" variant="h6" marginBottom={1}>Opis:</Typography>
                        <Typography textAlign="center" variant="h6">{article.technologyDTO.description}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={10.5} container marginTop={5}>
                <Typography textAlign="start" variant="h4" marginBottom={4}>{article.title}</Typography>
                <ArticleContent article={article}/>
            </Grid>
            <Grid item xs={6} container justifyContent="center" marginTop={4}>
                <FormControl fullWidth={true}>
                    <TextField
                        multiline
                        id="feedback"
                        placeholder="Ocena artykułu"
                        color="secondary"
                        rows={6}
                        value={feedback}
                        error={feedbackError != ''}
                        onChange={(event: any) => handleChangeFeedback(event.target.value)}
                        InputLabelProps={{
                            style: { color: feedbackError !== '' ? 'red' : '#5CA8EE' },
                        }}
                    />
                    <FormHelperText error>{feedbackError + ' '}</FormHelperText>
                </FormControl>
                <Grid item xs={4} container justifyContent="space-around" marginTop={2} marginBottom={4} columnSpacing={10}>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleAccept}
                        >
                            Akceptuj
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleReject}
                        >
                            Odrzuć
                        </Button>
                    </Grid>
                    <Grid item xs={6} marginTop={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('../')}
                        >
                            Anuluj
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default ArticleVerificationView;