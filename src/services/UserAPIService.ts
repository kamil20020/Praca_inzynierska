import axios from "axios";
import User from "../models/User";

export interface UpdateUserModel {
    nickname?: string,
    firstname?: string,
    surname?: string,
    email?: string,
    avatar?: string
} 

class UserAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/user`

    generateHeader = () => {
        const header = {
            headers: {
                ...axios.defaults.headers.common,
                'Content-Type': 'application/json'
            }
        }

        return header
    }

    
    getUserByUserAccountId = (userAccountId: string) => {
        return axios.get(`${this.apiUrl}/user-account-id/${userAccountId}`, this.generateHeader())
    }

    existsUserWithNickname = (nickname: string) => {
        return axios.get(`${this.apiUrl}/nickname/${nickname}`, this.generateHeader())
    }

    createUser = (user: User) => {
        return axios.post(this.apiUrl, user, this.generateHeader())
    }

    updateUser = (userId: number, user: UpdateUserModel) => {
        return axios.put(`${this.apiUrl}/${userId}`, user, this.generateHeader())
    }
}

export default new UserAPIService();