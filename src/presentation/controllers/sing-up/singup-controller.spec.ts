import { AddAccount, AccountModel, AddAccountModel, LoadAccountById, HttpRequest,Validation } from './singup-controller-protocols'
import { SingUpController } from './singup-controller'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { ok, badRequest } from '../../helpers/http/http-helper'

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
        async add (account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makefakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeLoadAccountById = (): LoadAccountById => {
    class LoadAccountByIdStub implements LoadAccountById {
        async load (accountId: any): Promise<AccountModel> {
            return new Promise(resolve => resolve(makefakeAccount()))
        }
    }
    return new LoadAccountByIdStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): Error | null {
            return null
        }
    }
    return new ValidationStub()
}
interface SutTypes {
    sut: SingUpController
    addAccountStub: AddAccount
    validationStub: Validation
    loadAccountByIdStub: LoadAccountById
}

const makefakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

const makeSut = (): SutTypes => {
    const addAccountStub = makeaddAccount()
    const validationStub = makeValidation()
    const loadAccountByIdStub = makeLoadAccountById()
    const sut = new SingUpController(addAccountStub,validationStub, loadAccountByIdStub)
    return {
        sut,
        addAccountStub,
        validationStub,
        loadAccountByIdStub
    }
}

describe('Sing up controller', () => {
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
    
    it('should call  LoadByEmail with correct values', async () => {
        const { sut, loadAccountByIdStub } = makeSut()
        const loadByIsSpy = jest.spyOn(loadAccountByIdStub, 'load')
        await loadAccountByIdStub.load('any_accout_id')
        expect(loadByIsSpy).toHaveBeenLastCalledWith('any_accout_id')
    })

    it('should return 401 if LoadByEmail returns null', async () => {
        const { sut, loadAccountByIdStub } = makeSut()
        jest.spyOn(loadAccountByIdStub, 'load').mockReturnValueOnce(null)
        const httpResponse = await sut.handle(makeFakeRequest())
        const account = await loadAccountByIdStub.load('any_accout_id')
        expect(httpResponse.statusCode).toBe(401)
    })

    it('should return an account on success', async () => {
        const { sut, loadAccountByIdStub } = makeSut()
        const account = await loadAccountByIdStub.load('any_accout_id')
        expect(account).toEqual(makefakeAccount())
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

    it('should retun 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makefakeAccount()))
    })

    it('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    })

    it('should retun 400 if validation return an error', async () => {
        const { sut , validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})