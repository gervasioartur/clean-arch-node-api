import { Hasher } from '@/data/protocols/criptography/hasher'
import { AccountModel } from '@/domain/models/Account'
import { AddAccountModel } from '@/domain/useCases/account/add-account'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { DbAddAccount } from "./db-add-acount"
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makefakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(null))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}
interface SuTypes {
    sut: DbAddAccount
    encryptStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makefakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_password'
})

const makeSut = (): SuTypes => {
    const encryptStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
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
        await sut.add(makeFakeAccountData())
        expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
    })

    it('should return null if LoadAccountByEmail not returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makefakeAccount())))
        const account = await sut.add(makeFakeAccountData())
        expect(account).toBeNull()
    })

    it('should call Hasher with correct password if LoadAccountByEmail return null', async () => {
        const { sut, encryptStub } = makeSut()
        const encryptSpy = jest.spyOn(encryptStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('hashed_password')
    })

    it('should throw if Hasher throws', async () => {
        const { sut, encryptStub } = makeSut()
        jest.spyOn(encryptStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        })
    })

    it('should return an account on success', async () => {
        const { sut } = makeSut()
        await sut.add(makeFakeAccountData())
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makefakeAccount())
    })
})
