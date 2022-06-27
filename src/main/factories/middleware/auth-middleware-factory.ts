import { AuthMiddleware, Middleware, makeDbLoadAccountByToken } from './auth-middleware-factory-prorcols'

export const makeAuthMiddleware = (role?: string): Middleware => {
    return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}