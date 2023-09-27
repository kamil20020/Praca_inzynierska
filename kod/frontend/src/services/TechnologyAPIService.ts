import axios from "axios";

class TechnologyAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/technology`

    getAll = () => {
        return axios.get(this.apiUrl)
    }

    getAllByTechnologyCategoryId = (technologyCategoryId: number) => {
        return axios.get(`${this.apiUrl}/category/${technologyCategoryId}`)
    }

}

export default new TechnologyAPIService();