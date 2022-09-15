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

        return axios.post(`${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`, body, header)
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

        return axios.post(`${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`, body, header)
    }
}

export default new KeycloakService()