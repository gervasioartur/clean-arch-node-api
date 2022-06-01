import { SingUpController } from './SingUp'
import {MissingParamError} from '../errors/missing-param-error'

describe('Sing up controller', () => {
    test('should retun 400 if no name is provided', () => {
        const sut = new SingUpController()
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmations: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should retun 400 if no name is provided', () => {
        const sut = new SingUpController()
        const httpRequest = {
            body: {
                name: "any_name",
                password: 'any_password',
                passwordConfirmations: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
})