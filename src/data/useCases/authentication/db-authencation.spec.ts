import { AccountModel } from '../../../domain/models/Account'
import { DbAuthentication } from './db-authencation'
import { 
    LoadAccountByEmailRepository,
    AuthenticationModel,
    HashComparer, 
    Encrypter, 
    UpdateAccessTokenRepository 
} from './db-authentication-protocols'

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load (email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
    class encrypterStub implements Encrypter {
        async encrypt (id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new encrypterStub()
}

const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare (value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashComparerStub()
}

const makeFaleAuth = (): AuthenticationModel => ({
    email: 'any_email@email.com',
    password: 'any_password'
})

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async update (id: string, token: string): Promise<void> {
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

describe('DbAuthentication useCase', () => {
    it('should call loadAccountByEmailRepository with correct email',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(makeFaleAuth())
        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    }) 

    it('should throw if loadAccountByEmailRepository throws',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFaleAuth())
        await expect(promise).rejects.toThrow()
    })

    it('should return null  loadAccountByEmailRepository return null',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
        const accesToken = await sut.auth(makeFaleAuth())
        expect(accesToken).toBeNull()
    }) 

    it('should call hashCompare with correct values',async () => { 
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFaleAuth())
        expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    }) 

    it('should throw if hashCompare throws',async () => { 
        const { sut,hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFaleAuth())
        await expect(promise).rejects.toThrow()
    })

    it('should return null  hashCompare return false',async () => { 
        const { sut,hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accesToken = await sut.auth(makeFaleAuth())
        expect(accesToken).toBeNull()
    }) 

    it('should call encrypter with correct id',async () => { 
        const { sut, encrypterStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFaleAuth())
        expect(generateSpy).toHaveBeenCalledWith('any_id')
    }) 

    it('should throw if hashCompare throws',async () => { 
        const { sut,encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFaleAuth())
        await expect(promise).rejects.toThrow()
    })

    it('should return a access token on success',async () => { 
        const { sut, encrypterStub } = makeSut()
        const accessToken = await sut.auth(makeFaleAuth())
        expect(accessToken).toBe('any_token')
    }) 

    it('should call updateAccessTokenRepository with correct values',async () => { 
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
        await sut.auth(makeFaleAuth())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    }) 

    it('should throw if updateAccessTokenRepository throws',async () => { 
        const { sut,updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.auth(makeFaleAuth())
        await expect(promise).rejects.toThrow()
    })
})