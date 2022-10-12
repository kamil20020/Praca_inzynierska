import { Grid, Typography, Button, Rating } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomAvatar from "../../components/common/CustomAvatar";
import CustomImage from "../../components/common/CustomImage";
import Image from "../../components/common/CustomImage";
import { roles } from "../../keycloak/KeycloakService";
import Article from "../../models/dto/Article";
import { TechnologyCategory } from "../../models/dto/TechnologyCategory";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import { RootState } from "../../redux/store";
import ArticleAPIService from "../../services/ArticleAPIService";
import Loading from "../Loading";
import parse from 'html-react-parser';
import { Editor } from "@tinymce/tinymce-react";

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

    const toRenderTechnologyCategoryTree = (technologyCategory: TechnologyCategory) => {

        const parentTechnologyCategory = technologyCategory.parentTechnologyCategoryDTO

        return (
            <React.Fragment>
                {parentTechnologyCategory ? toRenderTechnologyCategoryTree(parentTechnologyCategory) : null}
                <Typography textAlign="center" variant="h6" marginRight={1}>{technologyCategory.name} {"->"}</Typography>
            </React.Fragment>
        )
    }

    return (
        <Grid item xs={12} container alignItems="start" justifyContent="center" marginTop={4}>
            <Grid item xs={10.5} container justifyContent="space-between" direction="row">
                <Grid item xs={5} container direction="column" spacing={2}>
                    <Grid item container alignItems="center" spacing={3}>
                        <Grid item>
                            <CustomAvatar file={article.authorDTO.avatar}/>    
                        </Grid>
                        <Grid item>
                            <Typography textAlign="center" variant="h6">{article.authorDTO.nickname}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center">
                        <Typography textAlign="center" variant="h6">
                            Data utworzenia: {new Date(article.creationDate).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item container alignItems="center">
                        <Typography textAlign="center" variant="h6">
                            Data modyfikacji: {new Date(article.modificationDate).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item container alignItems="center">
                        {toRenderTechnologyCategoryTree(article.technologyDTO.technologyCategoryDTO)}
                        <Typography textAlign="center" variant="h6">{article.technologyDTO.name}</Typography>
                    </Grid>
                </Grid>
                {userId === (article as Article).authorDTO.id &&
                    <Grid item xs={5} container justifyContent="end" alignItems="start" spacing={3}>
                        <Grid item>
                            <Typography textAlign="center" variant="h6">Status: {article.status}</Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate(`../create-edit/${articleId}`)}
                            >
                                Edytuj artykuł
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                            >
                                Usuń artykuł
                            </Button>
                        </Grid>
                    </Grid>
                }
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
            <Grid item xs={10.5} marginTop={5}>
                <Typography textAlign="start" variant="h4" marginBottom={4}>{article.title}</Typography>
                <Typography textAlign="start" variant="h6">{parse(article.content)}</Typography>
                <Rating size="large" max={5} value={article.averageRating} precision={0.1} disabled sx={{opacity: 1, marginTop: 2}}/>
                {article.averageRating && 
                    <Typography textAlign="center" variant="h6">{article.averageRating}%</Typography>
                }
                <Grid container marginTop={3} spacing={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                        >
                            Komentarze
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                        >
                            Opinie
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ArticleView;