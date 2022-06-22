import { forbidden } from '../helpers/http/http-helper'
import { AccessDenied } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/useCases/load-account-by-token'
import { AccountModel } from '../../domain/models/Account'
import { HttpRequest } from '../protocols'

const makefakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
})

const makefakeRequest = (): HttpRequest => ({
    headers: {
        'x-access-token': 'any_token'
    }
})

const makeLoadAccoutnByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
            const account = makefakeAccount()
            return new Promise(resolve => resolve(account))
        }
    }
    return new LoadAccountByTokenStub()
}

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccoutnByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    return {
        sut,
        loadAccountByTokenStub
    }
}

describe('Auth Middlewrare', () => {
    it('should retrun 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()        
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDenied()))
    })

    it('should call LoadAccountByToken With correct accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()        
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        const httpResponse = await sut.handle(makefakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })
})