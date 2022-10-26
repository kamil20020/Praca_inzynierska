import axios from "axios";
import { ArticleSearchCriteria } from "../models/ArticleSearchCriteria";
import Article from "../models/dto/Article";
import { Pagination } from "../models/Pagination";

export interface CreateArticle {
    title: string,
    authorId: number,
    content: string,
    technologyId: number
}

export interface UpdateArticle {
    title?: string,
    content?: string,
    technologyId?: number
}

class ArticleAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/article`

    search = (searchCriteria: ArticleSearchCriteria, pagination: Pagination) => {
        return axios.post(`${this.apiUrl}/search`, searchCriteria, {
            params: {
                ...pagination
            },
        })
    }

    getAll = (pagination: Pagination) => {
        return axios.get(this.apiUrl, {
            params: {
                ...pagination
            }
        })
    }

    getById = (articleId: string) => {
        return axios.get(`${this.apiUrl}/${articleId}`)
    }

    createArticle = (article: CreateArticle) => {
        return axios.post(this.apiUrl, article)
    }

    updateArticleById = (articleId: string, article: CreateArticle) => {
        return axios.put(`${this.apiUrl}/${articleId}`, article)
    }
}

export default new ArticleAPIService();