import axios from "axios";
import GeneralAxiosService from "./GeneralAxiosService";

class TechnologyAPIService {

    private apiUrl: string = `${process.env.REACT_APP_API as string}/technology`

}

export default new TechnologyAPIService();