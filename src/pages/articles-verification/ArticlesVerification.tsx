import { Box, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomAvatar from "../../components/common/CustomAvatar";
import Article from "../../models/dto/Article";
import ArticleVerification from "../../models/dto/ArticleVerification";
import Page from "../../models/dto/Page";
import { RootState } from "../../redux/store";
import ArticleVerificationAPIService from "../../services/ArticleVerificationAPIService";

const columns: GridColDef[] = [
    { 
        field: 'title', 
        headerName: 'Tytuł',
        flex: 3,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams) => {
            const articleVerification: ArticleVerificationHeader = params.row
            return <React.Fragment>{articleVerification.articleDTO.title}</React.Fragment>
        }
    },
    {
        field: 'technology',
        headerName: 'Technologia',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams) => {
            const articleVerification: ArticleVerificationHeader = params.row
            return <React.Fragment>{articleVerification.articleDTO.technologyDTO.name}</React.Fragment>
        }
    },
    {
        field: 'technologyCategory',
        headerName: 'Kategoria',
        flex: 3,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams) => {
            const articleVerification: ArticleVerificationHeader = params.row
            return <React.Fragment>{articleVerification.articleDTO.technologyDTO.technologyCategoryDTO.name}</React.Fragment>
        }
    },
    {
        field: 'author',
        headerName: 'Autor',
        flex: 2,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams) => {
            const articleVerification: ArticleVerificationHeader = params.row
            return <React.Fragment>
                <CustomAvatar file={articleVerification.articleDTO.authorDTO.avatar} sx={{height: 32, width: 32, marginRight: 1.5}}/>
                {articleVerification.articleDTO.authorDTO.nickname}
            </React.Fragment>
        }
    },
    {
        field: 'toDate',
        headerName: 'Końocwy termin weryfikacji',
        flex: 3,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams) => {
            const articleVerification: ArticleVerificationHeader = params.row
            return <React.Fragment>{new Date(articleVerification.assignmentDate).toLocaleString()}</React.Fragment>
        }
    }
]

interface ArticleVerificationHeader {
    index: number,
    id: number,
    articleDTO: Article,
    assignmentDate: Date
}

const ArticlesVerification = () => {

    const userId = useSelector((state: RootState) => state.user.user).id

    const [articleVerifications, setArticleVerifications] = useState<ArticleVerificationHeader[]>([])
    const [page, setPage] = React.useState<number>(0)
    const [pageSize, setPageSize] = React.useState<number>(5)
    const [totalPages, setTotalPages] = React.useState<number>(0)

    const navigate = useNavigate()

    useEffect(() => {
        ArticleVerificationAPIService.getCreatedArticleVerificationsByReviewerId(userId, {page: page, size: pageSize})
        .then((response) => {
            const articles: Page = response.data
            let newArticleVerifications: ArticleVerificationHeader[] = [] 
            articles.content.forEach((a: ArticleVerification, index: number) => {
                newArticleVerifications.push({
                    index: index,
                    ...a
                })
            });
            setArticleVerifications(newArticleVerifications)
        })
    }, [])

    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center" spacing={5}>
            <Grid item xs={12}>
                <Typography textAlign="center" variant="h4">
                    Weryfikacja artykułów
                </Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <Box sx={{ height: 440, width: '66%' }}>
                    <DataGrid
                        rows={articleVerifications}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10]}
                        onPageChange={(page: number) => setPage(page)}
                        onPageSizeChange={(pageSize: number) => setPageSize(pageSize)}
                        onSelectionModelChange={(id) => {
                            console.log(articleVerifications, +id+1)
                            const articleVerification = articleVerifications
                                .filter(a => a.id ==  +id)[0]
                            navigate(`${articleVerification.id}`)
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default ArticlesVerification;