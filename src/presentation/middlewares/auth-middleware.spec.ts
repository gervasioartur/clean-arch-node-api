import { 
    ok,
    forbidden, 
    serverError, 
    HttpRequest, 
    AccessDeniedError, 
    LoadAccountByToken 
} from './auth-middleware-protocols'

import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '@/domain/models/Account'
import { mockAccountModel } from '@/domain/__test__'

const mockRequest = (): HttpRequest => ({
    headers: {
        authorization: 'Bear any_token'
    }
})

const makeLoadAccoutnByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
            const account = mockAccountModel()
            return new Promise(resolve => resolve(account))
        }
    }
    return new LoadAccountByTokenStub()
}

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccoutnByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
    return {
        sut,
        loadAccountByTokenStub
    }
}

describe('Auth Middlewrare', () => {
    it('should retrun 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()        
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    it('should call LoadAccountByToken With correct accessToken and role', async () => {
        const role = 'any_role'
        const { sut, loadAccountByTokenStub } = makeSut(role)        
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(mockRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token', role)
    })
    
    it('should call LoadAccountByToken With correct accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()        
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(mockRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })

    it('should retrun 403 if LoadAccountByToken return null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()    
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))    
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    it('should retrun 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSut()        
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
    })

    it('should retrun 500 if LoadAccountByToken throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()      
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))      
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})