export class UnauthorizedError extends Error {
    constructor () {
        super('unauthorized!')
        this.name = 'Unauthorized error'
    }
}
