import axios from "axios";
import { error } from "console";
import { access } from "fs";
import User from "../models/User";
import UserAPIService from "../services/UserAPIService";
import keycloak from "./Keycloak"

export interface Credentials {
    username: string,
    password: string
}

export interface UpdateCredentials {
    username?: string,
    password?: string
}

export interface Role{
    id: string,
    name: string
}

class KeycloakService {

    login(credentials: Credentials){

        const body = new URLSearchParams({
            client_id: keycloak.clientId as string,
            username: credentials.username,
            password: credentials.password,
            grant_type: 'password'
        });

        const header = {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        return axios.post(`${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/token`, body, header)
    }

    getAccessTokenOnRefreshToken = (refreshToken: string) => {

        const body = new URLSearchParams({
            client_id: keycloak.clientId as string,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });

        const header = {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        return axios.post(`${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/token`, body, header)
    }

    logout = (refreshToken: string) => {

        const body = new URLSearchParams({
            client_id: keycloak.clientId as string,
            refresh_token: refreshToken
        });

        const header = {
            headers: { 
                ...axios.defaults.headers.common,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        return axios.post(`${keycloak.url}/realms/${keycloak.realm}/protocol/openid-connect/logout`, body, header)
    }

    adminAuth = () => {

        const body = new URLSearchParams({
            username: 'admin',
            password: 'admin',
            grant_type: 'password',
            client_id: 'admin-cli'
        })

        const header = {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        return axios.post(`${keycloak.url}/realms/master/protocol/openid-connect/token`, body, header)
    }

    adminUnAuth = (accessToken: string, refreshToken: string) => {

        const body = new URLSearchParams({
            client_id: 'admin-cli',
            refresh_token: refreshToken
        });

        const header = {
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        return axios.post(`${keycloak.url}/realms/master/protocol/openid-connect/logout`, body, header)
    }

    addRoleToUser = (userId: string, roles: Role[], header: any) => {
        return axios.post(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${userId}/role-mappings/realm`, roles, header)
    }

    checkAccountAndUserCanBeCreated = (userCredentials: Credentials, user: User) => {

        return new Promise((resolve, reject) => {

            this.adminAuth()
            .then((response) => {
                const data = response.data
                const accessToken = data.access_token
                const refreshToken = data.refresh_token

                const header = {
                    headers: { 
                        'Authorization': `Bearer ${accessToken}`
                    }
                }

                let usernameParamQuery = new URLSearchParams()
                usernameParamQuery.set('username', userCredentials.username)
                usernameParamQuery.set('exact', String(true))

                axios.get(`${keycloak.url}/admin/realms/${keycloak.realm}/users?${usernameParamQuery.toString()}`, header) //user account with username exists
                .then((response) => {

                    if(response.data.length > 0){
                        throw new Error('Istnieje już konto o takiej nazwie użytkownika')
                    }

                    UserAPIService.existsUserWithNickname(user.nickname)
                    .then((response) => {

                        if(response.data){
                            throw new Error('Istnieje już użytkownik o takim pseudonimie')
                        }
                        resolve('Accept')
                    })
                    .catch((error) => {
                        this.adminUnAuth(accessToken, refreshToken)
                        reject(error)
                    })
                })
                .catch((error) => {
                    this.adminUnAuth(accessToken, refreshToken)
                    reject(error)
                })
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    register = (userCredentials: Credentials, user: User) => {

        return new Promise((resolve, reject) => {

            this.adminAuth()
            .then((response) => {
                const data = response.data
                const accessToken = data.access_token
                const refreshToken = data.refresh_token

                const header = {
                    headers: { 
                        'Authorization': `Bearer ${accessToken}`
                    }
                }

                const userAccountData = {
                    username: userCredentials.username,
                    credentials: [{
                            type: "password",
                            value: userCredentials.password,
                            temporary: false
                    }],
                    enabled: true
                }
        
                axios.post(`${keycloak.url}/admin/realms/${keycloak.realm}/users`, userAccountData, header) //create user account
                .then((response) => {
                    const userAccountId = response.headers.location.split('/')[7]
                    const roles = [{
                        id: "cec99090-10b9-4fc9-880c-9f72dca702eb",
                        name: "logged_user"
                    }]
                    this.addRoleToUser(userAccountId, roles, header)
                    .then((response) => {
                        this.adminUnAuth(accessToken, refreshToken)
                        user.userAccountId = userAccountId
                        UserAPIService.createUser(user)
                        .then((response) => {
                            resolve('Accept')
                        })
                        .catch((error) => {
                            reject(error)
                        })
                    })
                    .catch((error) => {
                        this.adminUnAuth(accessToken, refreshToken)
                        reject(error)
                    })
                })
                .catch((error) => {
                    this.adminUnAuth(accessToken, refreshToken)
                    reject(error)
                })
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    updateUserAccount = (accountId: string, credentials: UpdateCredentials) => {

        return new Promise((resolve, reject) => {

            this.adminAuth()
            .then((response) => {
                const data = response.data
                const accessToken = data.access_token
                const refreshToken = data.refresh_token

                const header = {
                    headers: { 
                        'Authorization': `Bearer ${accessToken}`
                    }
                }

                let body = {}

                if(credentials.username){
                    body = {
                        username: credentials.username
                    }
                }

                if(credentials.password){
                    body = {
                        ...body,
                        credentials: [{
                            type: "password",
                            value: credentials.password,
                            temporary: false
                        }]
                    }
                }

                axios.put(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${accountId}`, body, header)
                .then((response) => {
                    this.adminUnAuth(accessToken, refreshToken)
                    resolve(response)
                })
                .catch((error) => {
                    this.adminUnAuth(accessToken, refreshToken)
                    reject(error)
                })
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    setAxiosHeader = (access_token: string) => {
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${access_token}`
        }
    }

    decodeAccessToken = (access_token: string) => {
        const base64Url = access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }
        )
        .join(''));
    
        return JSON.parse(jsonPayload);
    }

    getUsernameFormAccessToken = (access_token: string) => {
        const decodedAccessToken = this.decodeAccessToken(access_token)
        return decodedAccessToken.preferred_username
    }
}

export default new KeycloakService()