import User from "./User";

export default interface Opinion {
    id: string,
    articleId: string,
    authorDTO: User,
    content: string,
    rating: number,
    creationDate: Date,
    modificationDate: Date
}