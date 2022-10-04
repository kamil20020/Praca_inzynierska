import axios from "axios";

class GeneralAxiosService {
    
    generateHeader = () => {
        const header = {
            headers: {
                ...axios.defaults.headers.common,
                'Content-Type': 'application/json'
            }
        }

        return header
    }
}

export default new GeneralAxiosService();