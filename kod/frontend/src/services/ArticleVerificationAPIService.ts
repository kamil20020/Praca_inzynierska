import axios from "axios";
import { ArticleVerificationStatus } from "../models/dto/ArticleVerification";
import { Pagination } from "../models/Pagination";

class ArticleVerificationAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/article-verification`

    getById = (articleVerificationId: number) => {
        return axios.get(`${this.apiUrl}/${articleVerificationId}`)
    }

    getByArticleId = (articleId: string) => {
        return axios.get(`${this.apiUrl}/article/${articleId}`)
    }

    getCreatedArticleVerificationsByReviewerId = (reviewerId: number, pagination: Pagination) => {
        return axios.get(`${this.apiUrl}/to/${reviewerId}`, {
            params: {
                ...pagination
            }
        })
    }

    changeArticleVerificationStatusById = (articleVerificationId: number, status: ArticleVerificationStatus, feedback: string) => {
        return axios.put(`${this.apiUrl}/${articleVerificationId}`, {}, {
            params: {
                status: Object.keys(ArticleVerificationStatus)[Object.values(ArticleVerificationStatus).indexOf(status)],
                feedback: feedback
            }
        })
    }
}

export default new ArticleVerificationAPIService();