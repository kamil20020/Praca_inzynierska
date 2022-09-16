import axios from "axios";
import keycloak from "./Keycloak"

export interface Credentials {
    username_email: string,
    password: string
}

class KeycloakService {

    login(credentials: Credentials){

        const body = new URLSearchParams({
            client_id: keycloak.clientId as string,
            username: credentials.username_email,
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

    register = (user: Object) => {

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

                user = {
                    username: 'adam9',
                    credentials: [
                        {
                            type: "password",
                            value: 'nowak',
                            temporary: false
                        }
                    ]
                }
                
                const body = {...user, enabled: true}

                axios.post(`${keycloak.url}/admin/realms/${keycloak.realm}/users`, body, header)
                .then((response) => {
                    this.adminUnAuth(accessToken, refreshToken)
                    resolve('Accept')
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
}

export default new KeycloakService()