import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../domain/models/Account'
import { DbAuthentication } from './db-authencation'
import { AuthenticationModel } from '../../../domain/useCases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-compare'

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

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer

}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub
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
})