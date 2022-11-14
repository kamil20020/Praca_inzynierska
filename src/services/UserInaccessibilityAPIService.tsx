import axios from "axios";
import UserInaccessibility from "../models/dto/UserInaccessibility";

export interface CreateUserInaccessibility {
    userId: number,
    toDate: Date
}

class UserInaccessibilityAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/user-inaccessibility`

    getUserInaccessibilityByUserId = (userId: number) => {
        return axios.get(`${this.apiUrl}/user/${userId}`)
    }

    createUserInaccessibility = (createUserInaccessibility: CreateUserInaccessibility) => {
        return axios.post(this.apiUrl, createUserInaccessibility)
    }

    removeUserInaccessibilityById = (userInaccessibilityById: number) => {
        return axios.delete(`${this.apiUrl}/${userInaccessibilityById}`)
    }
}

export default new UserInaccessibilityAPIService();