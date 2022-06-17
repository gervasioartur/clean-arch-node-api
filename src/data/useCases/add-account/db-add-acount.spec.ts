import { 
    AccountModel, 
    AddAccountModel, 
    AddAccountRepository, 
    Hasher 
} from "./add-account-protocols"
import { DbAddAccount } from "./db-add-acount"

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

interface SuTypes {
    sut: DbAddAccount
    encryptStub: Hasher
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
    const encryptStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub)
    return {
        sut,
        encryptStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount UseCase', () => {
    it('should call Hasher with correct password', async () => {
        const { sut, encryptStub } = makeSut()
        const encryptSpy = jest.spyOn(encryptStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('hashed_password')
    })

    // test ignorado
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
