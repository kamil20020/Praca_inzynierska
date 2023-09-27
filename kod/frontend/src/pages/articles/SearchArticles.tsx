import { Button, Card, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Pagination as PaginationView, Rating, Select, SelectChangeEvent, Switch, Typography } from "@mui/material";
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
import DatePickerForm from "../../components/common/DatePickerForm";
import DateRangePickerForm from "../../components/common/DateRangePickerForm";
import moment from "moment";
import { ArticleSearchCriteria } from "../../models/ArticleSearchCriteria";
import SelectTechnologyCategory from "../../components/common/SelectTechnologyCategory";
import SelectTechnology from "../../components/common/SelectTechnology";
import { ArticleSortParam } from "../../models/dto/ArticleSort";
import { SortType } from "../../models/dto/SortType";
import { SortParams } from "../../models/dto/SortParams";
import { Pagination } from "../../models/Pagination";
import SortService from "../../services/SortService";

interface FormFields {
    title?: string,
    authorNickname?: string,
    technologyCategoryId?: number,
    technologyId?: number,
    technologyProvider?: string,
    fromCreationDate?: Date,
    toCreationDate?: Date,
    fromModificationDate?: Date,
    toModificationDate?: Date,
};

interface ArticleHeaderProps {
    article: Article,
    technologyCategory?: object
}

const ArticleHeader = (props: ArticleHeaderProps) => {
    
    const article = props.article
    const userData = useSelector((state: RootState) => state.user).user
    const navigate = useNavigate()

    return (
        <Grid item>
            <Card 
                className="article-header" 
                variant="outlined" 
                sx={{
                    paddingTop: 2.5, 
                    paddingBottom: 2.5, 
                    borderColor: article.authorDTO.nickname === userData.nickname ? 'skyblue' : 'rgba(0, 0, 0, 0.12)'
                }}
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

interface ArticleSortProps {
    index: number,
    name: string,
    dir: string,
    value: string
}

const SearchArticles = () => {

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles

    const [form, setForm] = React.useState<FormFields>({})
    const [sort, setSort] = React.useState<ArticleSortProps | null>(null);
    const [showSearchCriteria, switchShowSearchCriteria] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0)
    const [pageSize, setPageSize] = React.useState<number>(5)
    const [articles, setArticles] = React.useState<Article[]>([])
    const [totalPages, setTotalPages] = React.useState<number>(0)

    const [searchCriteria, setSearchCriteria] = React.useState<ArticleSearchCriteria>({});

    const navigate = useNavigate();

    const userId = useSelector((state: RootState) => state.user).user.id

    const highestRole: string = actualRoles.includes(roles.administrator.name) ? roles.administrator.name : 
        actualRoles.includes(roles.reviewer.name) ? roles.reviewer.name : 
        actualRoles.includes(roles.logged_user.name) ? roles.logged_user.name : roles.user;

    const isLoggedUser: boolean = highestRole !== roles.user

    const articleSortOptions = {
        title: "Tytuł",
        creationDate: "Data utworzenia",
        modificationDate: "Data modyfikacji",
        averageScore: "Średnia ocena",
    }

    useEffect(() => {
        ArticleAPIService.search({}, {page: page, size: pageSize}, highestRole, isLoggedUser ? userId : undefined)
        .then((response) => {
            const page: Page = response.data
            setArticles(page.content)
            setTotalPages(page.totalPages)
        })
    }, [])

    const CustomPagination = () => {

        const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {

            let pagination: Pagination = {page: value-1, size: pageSize}

            if(sort != null){
                pagination.sort = SortService.generateArticleSort({name: sort.name, dir: sort.dir})
            }

            if(value-1 != page){
                ArticleAPIService.search(searchCriteria, pagination, highestRole, isLoggedUser ? userId : undefined)
                .then((response) => {
                    const page: Page = response.data
                    setPage(value-1)
                    setArticles(page.content)
                    setTotalPages(page.totalPages)
                })
            }
        };

        const getMenuItemsValues = () => {

            let articleSortParams: any[] = []
            let index = -1

            Object.keys(ArticleSortParam)
                .forEach((value: string) => {
                    articleSortParams.push({index: ++index, name: value, dir: SortType.ASC, value: `${(ArticleSortParam as any)[value]}: malejąco`})
                    articleSortParams.push({index: ++index, name: value, dir: SortType.DESC, value: `${(ArticleSortParam as any)[value]}: rosnąco`})
                })

            return articleSortParams
        }

        const menuItemsValues = getMenuItemsValues()

        return (
            <Grid item container justifyContent="center" alignItems="center" sx={{marginTop: 2, marginBottom: 4}}>
                <Grid item xs={6} container justifyContent="end">
                    <Grid item xs={5}>
                        <FormControl fullWidth>
                            <InputLabel id="article-sort-label" color="secondary">Sortowanie</InputLabel>
                            <Select
                                labelId="article-sort-label"
                                value={sort ? sort.index.toString() : ''}
                                color="secondary"
                                label="Age"
                                onChange={(event: SelectChangeEvent) => {
                                    setSort(event.target.value ? menuItemsValues[+event.target.value] : '')
                                }}
                            >
                                <MenuItem value={''}>-</MenuItem>
                                {menuItemsValues.map((value: any, index: number) => (
                                    <MenuItem key={index} value={index.toString()}>{value.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={6} container justifyContent="center">
                    <PaginationView 
                        count={totalPages} 
                        page={page+1}
                        onChange={handleChangePage} 
                        variant="outlined" 
                        color="secondary" 
                        shape="rounded" 
                    />
                </Grid>
            </Grid>
        )
    }

    const handleSearch = () => {   

        const newSearchCriteria = {
            ...form,
            fromCreationDate: form.fromCreationDate ? moment(form.fromCreationDate).toISOString() : undefined,
            toCreationDate: form.toCreationDate ? moment(form.toCreationDate).toISOString() : undefined,
            fromModificationDate: form.fromModificationDate ? moment(form.fromModificationDate).toISOString() : undefined,
            toModificationDate: form.toModificationDate ? moment(form.toModificationDate).toISOString() : undefined,
            role: highestRole
        }

        let pagination: Pagination = {page: page, size: pageSize}

        if(sort != null){
            pagination.sort = SortService.generateArticleSort({name: sort.name, dir: sort.dir})
        }

        setSearchCriteria(newSearchCriteria)

        ArticleAPIService.search(newSearchCriteria, pagination, highestRole, isLoggedUser ? userId : undefined)
        .then((response) => {
            const page: Page = response.data
            setPage(0)
            setArticles(page.content)
            setTotalPages(page.totalPages)
        })
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
                <Grid item xs={3.6} container direction="row" alignItems="stretch" justifyContent="center" spacing={2} marginTop={5}>
                    <FormElement 
                        fieldName="Tytuł" 
                        value={form.title ? form.title : ''} 
                        onChange={(event: any) => setForm({...form, title: event.target.value})}
                    />
                    <FormElement 
                        fieldName="Autor" 
                        value={form.authorNickname ? form.authorNickname : ''} 
                        onChange={(event: any) => setForm({...form, authorNickname: event.target.value})}
                    />
                    <SelectTechnologyCategory onSelect={(id: number) => setForm({...form, technologyCategoryId: id})}/>
                    <SelectTechnology 
                        selectedTechnologyCategoryId={form.technologyCategoryId}
                        onSelect={(id: number) => setForm({...form, technologyId: id})}
                    />
                    <FormElement 
                        fieldName="Dostawca technologii" 
                        value={form.technologyProvider ? form.technologyProvider : ''}
                        onChange={(event: any) => setForm({...form, technologyProvider: event.target.value})}
                    />
                    <DateRangePickerForm
                        fieldName="Data utworzenia"
                        fromValue={form.fromCreationDate}
                        toValue={form.toCreationDate}
                        onFromChange={(newDate: Date | null) => setForm({...form, fromCreationDate: newDate as Date | undefined})}
                        onToChange={(newDate: Date | null) => setForm({...form, toCreationDate: newDate as Date | undefined})}
                    />
                    <DateRangePickerForm
                        fieldName="Data modyfikacji"
                        fromValue={form.fromModificationDate}
                        toValue={form.toModificationDate}
                        onFromChange={(newDate: Date | null) => setForm({...form, fromModificationDate: newDate as Date | undefined})}
                        onToChange={(newDate: Date | null) => setForm({...form, toModificationDate: newDate as Date | undefined})}
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
                    onClick={handleSearch}
                >
                    Szukaj
                </Button>
            </Grid>
            <Grid item xs={10} container direction="column" alignItems="stretch" justifyContent="center" spacing={0} sx={{marginTop: 5}}>
                <CustomPagination/>
                {articles
                    .map((a: Article, index: number) => (
                        <ArticleHeader key={index} article={a}/>
                    ))
                }
                {articles.length > 7 && <CustomPagination/>}
            </Grid>
        </Grid>
    );
}

export default SearchArticles;