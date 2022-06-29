import { 
    Encrypter, 
    throwError,
    HashComparer, 
    mockEncrypter,
    Authentication, 
    mockHashComparer,
    mockAuthentication,
    AuthenticationParams,
    UpdateAccessTokenRepository,
    LoadAccountByEmailRepository,
    mockUpdateAccessTokenRepository, 
    mockLoadAccountByEmailRepository
} from './db-authencation-protocols'
export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) { }

    async auth (authentication: AuthenticationParams): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password)
            if (isValid) {
                const accessToken = await this.encrypter.encrypt(account.id)
                await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
                return accessToken
            }
        }
        return null
    }
}

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const hashComparerStub = mockHashComparer()
    const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
    const encrypterStub = mockEncrypter()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {
    it('should call loadAccountByEmailRepository with correct email',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(mockAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    }) 

    it('should throw if loadAccountByEmailRepository throws',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow()
    })

    it('should return null  loadAccountByEmailRepository return null',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
        const accesToken = await sut.auth(mockAuthentication())
        expect(accesToken).toBeNull()
    }) 

    it('should call hashCompare with correct values',async () => { 
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(mockAuthentication())
        expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
    }) 

    it('should throw if hashCompare throws',async () => { 
        const { sut,hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow()
    })

    it('should return null  hashCompare return false',async () => { 
        const { sut,hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accesToken = await sut.auth(mockAuthentication())
        expect(accesToken).toBeNull()
    }) 

    it('should call encrypter with correct id',async () => { 
        const { sut, encrypterStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(mockAuthentication())
        expect(generateSpy).toHaveBeenCalledWith('any_id')
    }) 

    it('should throw if hashCompare throws',async () => { 
        const { sut,encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow()
    })

    it('should return a access token on success',async () => { 
        const { sut, encrypterStub } = makeSut()
        const accessToken = await sut.auth(mockAuthentication())
        expect(accessToken).toBe('any_token')
    }) 

    it('should call updateAccessTokenRepository with correct values',async () => { 
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(mockAuthentication())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    }) 

    it('should throw if updateAccessTokenRepository throws',async () => { 
        const { sut,updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow()
    })
})