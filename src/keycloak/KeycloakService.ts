import axios from "axios";
import { error } from "console";
import { access } from "fs";
import User from "../models/dto/User";
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

export const roles = {
    user: "user",
    logged_user: {
        id: "cec99090-10b9-4fc9-880c-9f72dca702eb",
        name: "logged_user"
    },
    administrator: {
        id: "dd8865ea-a3ee-4569-9298-5ea705f5c475",
        name: "administrator"
    },
    reviewer: {
        id: "c59b2c5e-c209-4e66-8c07-d4a5a0625552",
        name: "reviewer"
    }
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

    addRoleToUser = (userId: string, role: Role) => {

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

                axios.post(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${userId}/role-mappings/realm`, [role], header)
                .then((response) => {
                    resolve(response.data)
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

    removeRoleFromUser = (userId: string, role: Role) => {

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

                axios.delete(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${userId}/role-mappings/realm`, {
                    ...header,
                    data: [role]
                })
                .then((response) => {
                    resolve(response.data)
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

    searchUserAccountByUsername = (username: string, exactSearch: boolean = false) => {

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
                usernameParamQuery.set('username', username)

                if(exactSearch){
                    usernameParamQuery.set('exact', String(true))
                }

                axios.get(`${keycloak.url}/admin/realms/${keycloak.realm}/users?${usernameParamQuery.toString()}`, header) //user account with username exists
                .then((response) => {
                    resolve(response.data)
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

    checkAccountAndUserCanBeCreated = (userCredentials: Credentials, user: User) => {

        return new Promise((resolve, reject) => {

            this.searchUserAccountByUsername(userCredentials.username, true) //user account with username exists
            .then((response) => {

                if((response as Array<any>).length > 0){
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
                    email: user.email,
                    emailVerified: true,
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
                    axios.post(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${userAccountId}/role-mappings/realm`, [roles.logged_user], header) // add user role
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

    getUserAccountRoles = (accountId: string) => {

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

                axios.get(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${accountId}/role-mappings/realm`, header)
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

    getUserAccountByUserAccountId = (accountId: string) => {

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

                axios.get(`${keycloak.url}/admin/realms/${keycloak.realm}/users/${accountId}`, header)
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

    resetUserPassword = (userAccountId: string) => {
        return this.updateUserAccount(userAccountId, {password: '1'})
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