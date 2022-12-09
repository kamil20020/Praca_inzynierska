import { SortDirection } from "@mui/material";
import { ArticleSortParam } from "../models/dto/ArticleSort";
import { SortParams } from "../models/dto/SortParams";

class SortService {

    generateArticleSort = (params: SortParams) => {
        return `${params.name},${params.dir}`
    }

}

export default new SortService();