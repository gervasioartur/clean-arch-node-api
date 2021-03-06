import { DbLoadAccountBytoken } from './db-load-account-by-token'
import { 
    Decrypter, 
    throwError,
    AccountModel, 
    mockDecrypter,
    mockAccountModel,
    LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols' 

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(mockAccountModel()))
        }
    }
    return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
    sut: DbLoadAccountBytoken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
    const decrypterStub = mockDecrypter()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const sut = new DbLoadAccountBytoken(decrypterStub, loadAccountByTokenRepositoryStub)

    return {
        sut,
        decrypterStub,
        loadAccountByTokenRepositoryStub
    }
}

describe('DbLoadAccountByToken', () => {
    it('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    it('should return null if Decrypter retuns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    it('should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
        await sut.load('any_token', 'any_role')
        expect(loadByTokenSpy).toBeCalledWith('any_token', 'any_role')
    })

    it('should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    it('should an account  on success', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        const account = await sut.load('any_token', 'any_role')
        expect(account).toEqual(mockAccountModel())
    })

    it('should throw if Decrypter throws', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })

    it('should throw if LoadAccountByTokenRepository throws', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError)
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })
})