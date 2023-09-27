import axios from "axios";

export interface CreateAcceptance {
    opinionId: string,
    userId: number,
    value: number
}

export interface DeleteAcceptance {
    opinionId: string,
    userId: number
}


class AcceptanceAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/acceptance`

    createAcceptance(create: CreateAcceptance){
        return axios.post(`${this.apiUrl}/`, create)
    }

    deleteAcceptance(deleteAcceptance: DeleteAcceptance){
        return axios.delete(`${this.apiUrl}/`, {
            params: {
                ...deleteAcceptance
            }
        })
    }


}

export default new AcceptanceAPIService();