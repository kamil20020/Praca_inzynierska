import Article from "./Article";

export enum ArticleVerificationStatus{
    CREATED = "Utworzona weryfikacja",
    ACCEPTED = "Zaakceptowany",
    REJECTED = "Odrzucony",
    EXPIRED = "Przedawniona weryfikacja"
}

export default interface ArticleVerification {
    id: number,
    articleDTO: Article,
    assignmentDate: Date,
    status: ArticleVerificationStatus,
    feedbackMessage: string
}