import axios from "axios";
import { Pagination } from "../models/Pagination";

export interface CreateComment {
    articleId: string,
    parentCommentId?: string,
    authorId: number,
    content: string
}

export interface UpdateComment {
    content?: string
}

class CommentAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/comment`

    getParentComments = (pagination: Pagination) => {
        return axios.get(`${this.apiUrl}/parents`, {
            params: {
                ...pagination
            }
        })
    }

    getSubComments = (parentCommentId: string, pagination: Pagination) => {
        return axios.get(`${this.apiUrl}/subs/${parentCommentId}`, {
            params: {
                ...pagination
            }
        })
    }

    createComment = (createComment: CreateComment) => {
        return axios.post(this.apiUrl, createComment)
    }

    updateCommentById = (commentId: string, updateComment: UpdateComment) => {
        return axios.put(`${this.apiUrl}/${commentId}`, updateComment)
    }

    deleteCommentById = (commentId: string) => {
        return axios.delete(`${this.apiUrl}/${commentId}`)
    }
}

export default new CommentAPIService();