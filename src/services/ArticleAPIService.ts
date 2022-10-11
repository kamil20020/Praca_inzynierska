import axios from "axios";
import { Pagination } from "../models/Pagination";

    class ArticleAPIService {

        private apiUrl: string = `${process.env.REACT_APP_API as string}/article`

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
    }

    export default new ArticleAPIService();