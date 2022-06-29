import { throwError } from '@/domain/__test__'
import { mockValidation } from '@/validation/__test__'
import { 
    ok, 
    badRequest, 
    Validation, 
    HttpRequest, 
    serverError, 
    unauthorized, 
    Authentication, 
    LoginController, 
    MissingParamError,
    mockAuthentication
} from './login-controller-protocols'

interface SutTypes {
    sut: LoginController
    authenticatioStub: Authentication
    validationStub: Validation
}

const mockRequest = (): HttpRequest => ({
    body: {
        email: "any_email@email.com",
        password: "any_password"
    }
})

const makeSut = (): SutTypes => {
    const authenticatioStub = mockAuthentication()
    const validationStub = mockValidation()
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
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@email.com', password: 'any_password' })
    })

    it('Should return 401 if invalid credencials are provided', async () => {
        const { sut, authenticatioStub } = makeSut()
        jest.spyOn(authenticatioStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    it('Should should return 500 if authentication throws', async () => {
        const { sut, authenticatioStub } = makeSut()
        jest.spyOn(authenticatioStub, 'auth').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    it('Should should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })

    it('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    })

    it('should retun 400 if validation return an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})