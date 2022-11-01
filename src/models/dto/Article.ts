import { Status } from "./Status"
import { Technology } from "./Technology"
import User from "./User"

export default interface Article {
    id: string,
    authorDTO: User,
    technologyDTO: Technology,
    title: string,
    content: string,
    status: Status,
    creationDate: Date,
    modificationDate: Date,
    averageRating?: number
}