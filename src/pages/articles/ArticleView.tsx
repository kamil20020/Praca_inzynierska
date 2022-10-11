import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { roles } from "../../keycloak/KeycloakService";
import Article from "../../models/dto/Article";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import { RootState } from "../../redux/store";
import ArticleAPIService from "../../services/ArticleAPIService";
import Loading from "../Loading";

const ArticleView = () => {

    const params = useParams();
    const articleId = params.articleId as string;   
    const userId = useSelector((state: RootState) => state.user).user.id
    const dispatch = useDispatch()

    const [article, setArticle] = React.useState<Article | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        ArticleAPIService.getById(articleId)
        .then((response) => {
            setArticle(response.data)
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
            navigate("../")
        })
    }, [])

    if(article == null){
        return <Loading/>
    }

    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Grid item xs={12} container justifyContent="center" sx={{marginTop: 7}}>
                <Typography textAlign="center" variant="h4" sx={{marginRight: 5}}>
                    {article.title}
                </Typography>
                {userId === (article as Article).authorDTO.id &&
                    <Button
                        variant="contained"
                        color="secondary"
                    >
                        Edytuj artykuł
                    </Button>
                }
                {userId === (article as Article).authorDTO.id &&
                    <Button
                        variant="contained"
                        color="secondary"
                    >
                        Usuń artykuł
                    </Button>
                }
            </Grid>
        </Grid>
    );
}

export default ArticleView;