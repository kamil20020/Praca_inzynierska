import axios from "axios";
import User from "../models/dto/User";
import GeneralAxiosService from "./GeneralAxiosService";

export interface UpdateUserModel {
    nickname?: string,
    firstname?: string,
    surname?: string,
    email?: string,
    avatar?: string
} 

class UserAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/user`
    
    getUserByUserAccountId = (userAccountId: string) => {
        return axios.get(`${this.apiUrl}/user-account-id/${userAccountId}`, GeneralAxiosService.generateHeader())
    }

    existsUserWithNickname = (nickname: string) => {
        return axios.get(`${this.apiUrl}/nickname/${nickname}`, GeneralAxiosService.generateHeader())
    }

    createUser = (user: User) => {
        return axios.post(this.apiUrl, user, GeneralAxiosService.generateHeader())
    }

    updateUser = (userId: number, user: UpdateUserModel) => {
        return axios.put(`${this.apiUrl}/${userId}`, user, GeneralAxiosService.generateHeader())
    }
}

export default new UserAPIService();