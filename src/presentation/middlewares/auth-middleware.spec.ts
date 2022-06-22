import { forbidden } from '../helpers/http/http-helper'
import { AccessDenied } from '../errors'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middlewrare', () => {
    it('should retrun 403 if no x-access-token exists in headers', async () => {
        const sut = new AuthMiddleware()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDenied()))
    })
})