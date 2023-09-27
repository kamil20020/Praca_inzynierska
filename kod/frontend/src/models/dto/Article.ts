import { ArticleStatus } from "./ArticleStatus"
import { Technology } from "./Technology"
import User from "./User"

export default interface Article {
    id: string,
    authorDTO: User,
    technologyDTO: Technology,
    title: string,
    content: string,
    status: ArticleStatus,
    creationDate: Date,
    modificationDate: Date,
    averageRating?: number
}