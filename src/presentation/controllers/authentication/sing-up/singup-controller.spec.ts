import { HttpRequest, AddAccount, AddAccountParams, Validation, AccountModel, Authentication, AuthenticationParams, SingUpController, badRequest, MissingParamError, serverError, ok, ServerError } from './singup-controller-protoccols'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeaddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountParams): Promise<AccountModel> {
            return new Promise(resolve => resolve(makefakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error | null {
            return null
        }
    }
    return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticatioStub implements Authentication {
        async auth (Authentication: AuthenticationParams): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticatioStub()
}
interface SutTypes {
    sut: SingUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
}

const makefakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
})

const makeSut = (): SutTypes => {
    const addAccountStub = makeaddAccount()
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new SingUpController(addAccountStub, validationStub, authenticationStub)
    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

describe('Sing up controller', () => {
    it('should call validation with correct value', async () => {
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

    it('should call add account with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenLastCalledWith({
            name: "any_name",
            email: 'any_email@email.com',
            password: 'any_password'
        })
    })

    it('should retun 403 if  addAcount returns null', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toBe(403)
    })

    it('should retun 500 if  addAcount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(''))
    })

    it('Should  call authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest())
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@email.com',
            password: 'any_password'
        })
    })

    it('Should  return 500 if authentication thows', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toBe(500)
    })

    it('Should statusCode 200 and accessToken on success', async () => {
        const { sut, authenticationStub } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
})