import { DbAddAccount } from "./db-add-acount"
import {
    Hasher,
    mockHasher,
    throwError,
    AccountModel,
    mockAccountModel,
    mockAddAccountParams,
    AddAccountRepository,
    mockAddAccountRepository,
    LoadAccountByEmailRepository
} from './db-add-account-protocols'

interface SuTypes {
    sut: DbAddAccount
    encryptStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(null))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SuTypes => {
    const encryptStub = mockHasher()
    const addAccountRepositoryStub = mockAddAccountRepository()
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
        sut,
        encryptStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAddAccount UseCase', () => {
    it('should call loadAccountByEmailRepository with correct value',async () => { 
        const { sut,loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(mockAddAccountParams())
        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    it('should return null if LoadAccountByEmail not returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(mockAccountModel())))
        const account = await sut.add(mockAddAccountParams())
        expect(account).toBeNull()
    })

    it('should call Hasher with correct password if LoadAccountByEmail returns null', async () => {
        const { sut, encryptStub } = makeSut()
        const encryptSpy = jest.spyOn(encryptStub, 'hash')
        await sut.add(mockAddAccountParams())
        expect(encryptSpy).toHaveBeenCalledWith('any_password')
    })

    it('should throw if Hasher throws', async () => {
        const { sut, encryptStub } = makeSut()
        jest.spyOn(encryptStub, 'hash').mockImplementationOnce(throwError)
        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(mockAddAccountParams())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        })
    })

    it('should return an account on success', async () => {
        const { sut } = makeSut()
        await sut.add(mockAddAccountParams())
        const account = await sut.add(mockAddAccountParams())
        expect(account).toEqual(mockAccountModel())
    })
})
