import { MissingParamError } from "../../../errors"
import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/http-helper"
import { HttpRequest, Authentication, Validation } from "./login-controller-protocols"
import { LoginController } from "./login-controller"
import { AuthenticationModel } from '../../../../domain/useCases/authentication'

interface SutTypes {
    sut: LoginController
    authenticatioStub: Authentication
    validationStub: Validation
}

const makeAuthentication = (): Authentication => {
    class AuthenticatioStub implements Authentication {
        async auth (Authentication: AuthenticationModel): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticatioStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: "any_email@email.com",
        password: "any_password"
    }
})

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeSut = (): SutTypes => {
    const authenticatioStub = makeAuthentication()
    const validationStub = makeValidation()
    const sut = new LoginController(authenticatioStub, validationStub)
    return {
        sut,
        authenticatioStub,
        validationStub
    }
}
describe('Login Controller', () => {
    it('Should should call authentication with correct values', async () => {
        const { sut, authenticatioStub } = makeSut()
        const authSpy = jest.spyOn(authenticatioStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@email.com', password: 'any_password' })
    })

    it('Should return 401 if invalid credencials are provided', async () => {
        const { sut, authenticatioStub } = makeSut()
        jest.spyOn(authenticatioStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    it('Should should return 500 if authentication throws', async () => {
        const { sut, authenticatioStub } = makeSut()
        jest.spyOn(authenticatioStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    it('Should should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })

    it('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    })

    it('should retun 400 if validation return an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})