import { Button, Card, FormControlLabel, Grid, OutlinedInput, Pagination, Rating, Switch, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { roles } from "../../keycloak/KeycloakService";
import { TechnologyCategory } from "../../models/dto/TechnologyCategory";
import { RootState } from "../../redux/store";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './Articles.css'
import Article from "../../models/dto/Article";
import ArticleAPIService from "../../services/ArticleAPIService";
import Page from "../../models/dto/Page";
import CustomAvatar from "../../components/common/CustomAvatar";
import { useNavigate } from "react-router-dom";
import FormElement from "../../components/common/FormElement";

interface FormFields {
    title: string,
    author: string,
    technologyCategory: string,
    technologyProvider: string,
    creationDate: string,
    modificationDate: string,
};

interface ArticleHeaderProps {
    article: Article,
    technologyCategory?: object
}

const ArticleHeader = (props: ArticleHeaderProps) => {
    
    const article = props.article
    const navigate = useNavigate()

    return (
        <Grid item>
            <Card 
                className="article-header" 
                variant="outlined" 
                sx={{paddingTop: 2.5, paddingBottom: 2.5}}
                onClick={(event: any) => navigate(`details/${article.id}`)}
            >
                <Grid container justifyContent="space-evenly" alignItems="center">
                    <Grid item xs={1.92}>
                        <Typography textAlign="center" variant="h6">{article.title}</Typography>
                    </Grid>
                    <Grid item xs={1.92}>
                        <Typography textAlign="center" variant="h6">{article.technologyDTO.name}</Typography>
                    </Grid>
                    <Grid item xs={1.92}>
                        <Typography textAlign="center" variant="h6">{article.technologyDTO.technologyCategoryDTO.name}</Typography>
                    </Grid>
                    <Grid item xs={1.92} container justifyContent="center" alignItems="center" spacing={3}>
                        <Grid item>
                            <CustomAvatar file={article.authorDTO.avatar}/>    
                        </Grid>
                        <Grid item >
                            <Typography textAlign="center" variant="h6">{article.authorDTO.nickname}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={1.92}>
                        <Typography textAlign="center" variant="h6">{new Date(article.modificationDate).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={1.92} container alignItems="center" justifyContent="center" spacing={1.2}>
                        <Grid item>
                            <Rating name="customized-10" size="large" max={1} value={article.averageRating} precision={0.1} disabled sx={{opacity: 1}}/>
                        </Grid>
                        {article.averageRating && 
                            <Grid item>
                                <Typography textAlign="center" variant="h6">{article.averageRating}%</Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
}

const SearchArticles = () => {

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles

    const initialFormState = {
        title: '',
        author: '',
        technologyCategory: '',
        technologyProvider: '',
        creationDate: '',
        modificationDate: '',
    }

    const [form, setForm] = React.useState<FormFields>(initialFormState)
    const [showSearchCriteria, switchShowSearchCriteria] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0)
    const [pageSize, setPageSize] = React.useState<number>(2)
    const [articles, setArticles] = React.useState<Article[]>([])
    const [totalPages, setTotalPages] = React.useState<number>(0)

    const navigate = useNavigate()

    useEffect(() => {
        ArticleAPIService.getAll({page: page, size: pageSize})
        .then((response) => {
            const page: Page = response.data
            setArticles(page.content)
            setTotalPages(page.totalPages)
        })
    }, [])

    const CustomPagination = () => {

        const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
            setPage(value-1);
        };

        return (
            <Grid item container justifyContent="center" sx={{marginTop: 2, marginBottom: 4}}>
                <Pagination 
                    count={totalPages} 
                    page={page+1}
                    onChange={handleChangePage} 
                    variant="outlined" 
                    color="secondary" 
                    shape="rounded" 
                />
            </Grid>
        )
    }

    return (
        <Grid item xs={12} container alignItems="start" justifyContent="center">
            <Grid item xs={12} container justifyContent="center" sx={{marginTop: 7}}>
                <Typography textAlign="center" variant="h4" sx={{marginRight: 5}}>
                    Wyszukiwanie artykułów
                </Typography>
                {actualRoles.includes(roles.logged_user.name) &&
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`create-edit/${null}`)}
                    >
                        Dodaj artykuł
                    </Button>
                }
            </Grid>
            {showSearchCriteria &&
                <Grid item xs={3} container direction="row" alignItems="stretch" justifyContent="center" spacing={2} marginTop={5}>
                    <FormElement 
                        fieldName="Tytuł" 
                        value={form.title} 
                        onChange={(event: any) => setForm({...form, title: event.target.value})}
                    />
                    <FormElement 
                        fieldName="Autor" 
                        value={form.author} 
                        onChange={(event: any) => setForm({...form, author: event.target.value})}
                    />
                    <FormElement 
                        fieldName="Kategoria technologii" 
                        value={form.technologyCategory} 
                        onChange={(event: any) => setForm({...form, technologyCategory: event.target.value})}
                    />
                    <FormElement 
                        fieldName="Dostawca technologii" 
                        value={form.technologyProvider}
                        onChange={(event: any) => setForm({...form, technologyProvider: event.target.value})}
                    />
                    <FormElement 
                        fieldName="Data utworzenia" 
                        value={form.creationDate} 
                        onChange={(event: any) => setForm({...form, creationDate: event.target.value})}
                    />
                    <FormElement 
                        fieldName="Data modyfikacji" 
                        value={form.modificationDate} 
                        onChange={(event: any) => setForm({...form, modificationDate: event.target.value})}
                    />
                </Grid>
            }
            <Grid item xs={12} container justifyContent="center" sx={{marginTop: 6}}>
                <Grid item xs={12} container justifyContent="center" alignItems="center" marginBottom={2}>
                    <FormControlLabel
                        control={
                            <Switch color="secondary" checked={showSearchCriteria} onChange={() => switchShowSearchCriteria(!showSearchCriteria)}/>
                        }
                        label={showSearchCriteria ? "Ukryj kryteria wyszukiwania" : "Pokaż kryteria wyszukiwania"}
                    />
                </Grid>
                <Button
                    variant="contained"
                    color="secondary"
                >
                    Szukaj
                </Button>
            </Grid>
            <Grid item xs={10} container direction="column" alignItems="stretch" justifyContent="center" spacing={0} sx={{marginTop: 5}}>
                {articles.length > 7 && <CustomPagination/>}
                {articles
                    .slice(page * pageSize, page * pageSize + pageSize)
                    .map((a: Article, index: number) => (
                        <ArticleHeader key={index} article={a}/>
                    ))
                }
                <CustomPagination/>
            </Grid>
        </Grid>
    );
}

export default SearchArticles;