export default interface User {
    id: number,
    username: string,
    firstname: string,
    surname: string,
    email: string,
    avatar?: Blob
}