import {SingUpController} from './SingUp'

describe('Sing up controller', () => {
    test('should retun 400 if no name is provided', () => {
        const sut = new SingUpController()
        const httpResquest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmations: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpResquest)
        expect(httpResponse.statusCode).toBe(400)
    })
})