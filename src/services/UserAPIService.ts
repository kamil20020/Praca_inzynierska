import axios from "axios";
import User from "../models/User";

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

    createUser = (user: User) => {
        return axios.post(this.apiUrl, user, this.generateHeader())
    }

    existsUserWithNickname = (nickname: string) => {
        return axios.get(`${this.apiUrl}/nickname/${nickname}`, this.generateHeader())
    }

    getUserByUserAccountId = (userAccountId: string) => {
        return axios.get(`${this.apiUrl}/user-account-id/${userAccountId}`, this.generateHeader())
    }
}

export default new UserAPIService();