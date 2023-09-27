import axios from "axios"

export interface CreateOpinion {
    authorId: number,
    articleId: string,
    rating: number,
    content: string,
}

export interface UpdateOpinion {
    rating?: number,
    content?: string,
}

class OpinionAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}`

    existsByAuthorId(authorId: number){
        return axios.get(`${this.apiUrl}/opinion/author/${authorId}`)
    }

    getAllByArticleId(articleId: string, userId: number){
        return axios.get(`${this.apiUrl}/opinions/article/${articleId}`, {
            params: userId ? {userId: userId} : {}
        })
    }

    create(opinion: CreateOpinion){
        return axios.post(`${this.apiUrl}/opinion`, opinion)
    }

    updateById(id: string, opinion: UpdateOpinion){
        return axios.put(`${this.apiUrl}/opinion/${id}`, opinion)
    }

    deleteById(id: string){
        return axios.delete(`${this.apiUrl}/opinion/${id}`)
    }
}

export default new OpinionAPIService()