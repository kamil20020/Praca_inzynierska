import { Grid, Typography, Button, Rating } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomAvatar from "../../components/common/CustomAvatar";
import CustomImage from "../../components/common/CustomImage";
import Article from "../../models/dto/Article";
import { TechnologyCategory } from "../../models/dto/TechnologyCategory";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import { RootState } from "../../redux/store";
import ArticleAPIService from "../../services/ArticleAPIService";
import Loading from "../Loading";
import parse from 'html-react-parser';
import Comments from "./Comments";
import Opinions from "./Opinions";
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
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

const ArticleView = () => {

    const params = useParams();
    const articleId = params.articleId as string;   
    const userId = useSelector((state: RootState) => state.user).user.id
    const dispatch = useDispatch()

    const [article, setArticle] = React.useState<Article | null>(null)
    const [isSelectedComments, setIsSelectedComments] = React.useState<boolean>(true);

    const navigate = useNavigate()

    useEffect(() => {
        Prism.highlightAll();
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

    const ArticleContent = () => {

        useEffect(() => {
            Prism.highlightAll();
        }, [])

        return (
            <Typography textAlign="start" variant="h6">
                {parse(article.content)}    
            </Typography>
        )
    }

    return (
        <Grid item xs={12} container alignItems="start" justifyContent="center" marginTop={4}>
            <Grid item xs={10.5} container justifyContent="space-between" direction="row">
                <Grid item xs={7} container direction="column" spacing={2}>
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
                            <ConfirmationDialog 
                                buttonTitle="Usuń artykuł" 
                                title="Czy napewno ten artykuł powinien zostać usunięty?" 
                                onAccept={() => null} 
                                onCancel={() => null}
                            />
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
                <ArticleContent/>
                <Rating size="large" max={5} value={article.averageRating} precision={0.1} disabled sx={{opacity: 1, marginTop: 2}}/>
                {article.averageRating && 
                    <Typography textAlign="center" variant="h6">{article.averageRating}%</Typography>
                }
                <Grid container marginTop={3} spacing={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsSelectedComments(true)}
                        >
                            Komentarze
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsSelectedComments(false)}
                        >
                            Opinie
                        </Button>
                    </Grid>
                </Grid>
                <Grid container marginTop={3} spacing={2}>
                    {isSelectedComments ? <Comments/> : <Opinions/>}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ArticleView;