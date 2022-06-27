import { AccountModel } from '@/domain/models/Account'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { Authentication, AuthenticationModel } from '@/domain/useCases/authentication'
import { HashComparer } from '@/data/protocols/criptography/hash-compare';
import { Encrypter } from '@/data/protocols/criptography/encrypter';

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) { }

    async auth (authentication: AuthenticationModel): Promise<string> {
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

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new EncrypterStub()
}

const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare (value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashComparerStub()
}

const makeFakeAuth = (): AuthenticationModel => ({
    email: 'any_email@email.com',
    password: 'any_password'
})

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async updateAccessToken (id: string, token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const encrypterStub = makeEncrypter()
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
        await sut.auth(makeFakeAuth())
        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    }) 

    it('should throw if loadAccountByEmailRepository throws',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

    it('should return null  loadAccountByEmailRepository return null',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
        const accesToken = await sut.auth(makeFakeAuth())
        expect(accesToken).toBeNull()
    }) 

    it('should call hashCompare with correct values',async () => { 
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeAuth())
        expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    }) 

    it('should throw if hashCompare throws',async () => { 
        const { sut,hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

    it('should return null  hashCompare return false',async () => { 
        const { sut,hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accesToken = await sut.auth(makeFakeAuth())
        expect(accesToken).toBeNull()
    }) 

    it('should call encrypter with correct id',async () => { 
        const { sut, encrypterStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFakeAuth())
        expect(generateSpy).toHaveBeenCalledWith('any_id')
    }) 

    it('should throw if hashCompare throws',async () => { 
        const { sut,encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })

    it('should return a access token on success',async () => { 
        const { sut, encrypterStub } = makeSut()
        const accessToken = await sut.auth(makeFakeAuth())
        expect(accessToken).toBe('any_token')
    }) 

    it('should call updateAccessTokenRepository with correct values',async () => { 
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(makeFakeAuth())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    }) 

    it('should throw if updateAccessTokenRepository throws',async () => { 
        const { sut,updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuth())
        await expect(promise).rejects.toThrow()
    })
})