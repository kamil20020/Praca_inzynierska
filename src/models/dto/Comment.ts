import User from "./User";

export default interface Comment {
    id: string,
    articleId: string,
    parentCommentId: string,
    authorDTO: User,
    content: string,
    creationDate: Date,
    modificationDate: Date
}