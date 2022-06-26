import { Middleware, LoadAccountByToken, HttpRequest, HttpResponse, forbidden, AccessDeniedError, serverError, ok } from './auth-middleware-protocols'
export class AuthMiddleware implements Middleware {
    constructor (
        private readonly loadAccountByToken: LoadAccountByToken,
        private readonly role?: string
    ) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const token = `${httpRequest.headers?.authorization}`
            const accessToken = token.split(' ')[1]
            if (accessToken) {
                let account = null
                if (this.role) {
                    account = await this.loadAccountByToken.load(accessToken, this.role)
                } else {
                    account = await this.loadAccountByToken.load(accessToken)
                }

                if (account) {
                    return ok({ accountId: account.id })
                }
            }
            return forbidden(new AccessDeniedError())
        } catch (error) {
            return serverError(new Error())
        }
    }
}