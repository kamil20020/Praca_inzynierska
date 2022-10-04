import axios from "axios"
import GeneralAxiosService from "./GeneralAxiosService"

class TechnologyExpertAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/technology-expert`

    getAllByUserIdAndContainingTechnologyName = (userId: number, technologyName: string) => {

        return axios.get(`${this.apiUrl}/user/${userId}`, {
            params: {
                technology_name: technologyName
            },
            ...GeneralAxiosService.generateHeader()
        })
    }

    getAllTechnologiesWhichUserHasnt = (userId: number) => {
        return axios.get(`${this.apiUrl}/user/${userId}/assignable-technologies`, GeneralAxiosService.generateHeader())
    }

    getAllTechnologiesByTechnologyCategoryIdWhichUserHasnt = (userId: number, technologyCategoryId: number) => {
        return axios.get(
            `${this.apiUrl}/user/${userId}/assignable-technologies/technology-category/${technologyCategoryId}`, 
            GeneralAxiosService.generateHeader()
        )
    }

    create = (userId: number, technologyId: number) => {
        return axios.post(`${this.apiUrl}/user/${userId}`, technologyId, GeneralAxiosService.generateHeader())
    }

    deleteById = (technologyExpertId: number) => {
        return axios.delete(`${this.apiUrl}/${technologyExpertId}`, GeneralAxiosService.generateHeader())
    }
}

export default new TechnologyExpertAPIService();