import User from "./User";

export default interface Opinion {
    id: string,
    author: User,
    articleId: string,
    rating: number,
    content: string,
    creationDate: Date,
    modificationDate: Date,
    positiveAcceptancesCount: number,
    negativeAcceptancesCount: number,
    loggedUserAcceptance: number
}