import axios from "axios";
import GeneralAxiosService from "./GeneralAxiosService";

class TechnologyCategory {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/technology-category`

    getTreeOfTechnologyCategories = () => {
        return axios.get(`${this.apiUrl}/tree`, GeneralAxiosService.generateHeader())
    }

    getTechnologyCategoryById = (technologyCategoryId: number) => {
        return axios.get(`${this.apiUrl}/${technologyCategoryId}`)
    }
}

export default new TechnologyCategory();