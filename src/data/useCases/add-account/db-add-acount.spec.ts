import { 
    AccountModel, 
    AddAccountModel, 
    AddAccountRepository, 
    Encrypter 
} from "./add-account-protocols"
import { DbAddAccount } from "./db-add-acount"

const makeEncrypter = (): Encrypter => {
    class EncryptStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncryptStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makefakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

interface SuTypes {
    sut: DbAddAccount
    encryptStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makefakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
})

const makeSut = (): SuTypes => {
    const encryptStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub)
    return {
        sut,
        encryptStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount UseCase', () => {
    it('should call Encrypter with correct password', async () => {
        const { sut, encryptStub } = makeSut()
        const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('hashed_password')
    })

    // test ignorado
    it('should throw if encrypter throws', async () => {
        const { sut, encryptStub } = makeSut()
        jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })

    it('should return asn account on success', async () => {
        const { sut } = makeSut()
        await sut.add(makeFakeAccountData())
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makefakeAccount())
    })
})
