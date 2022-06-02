import { Encrypter } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-acount"

interface SuTypes {
    sut: DbAddAccount
    encryptStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncryptStub implements Encrypter {
        encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncryptStub()
}

const makeSut = (): SuTypes => {
    const encryptStub = makeEncrypter()
    const sut = new DbAddAccount(encryptStub)
    return {
        sut,
        encryptStub
    }
}

describe('DbAddAccount UseCase', () => {
    it('should call Encrypter with correct password', async () => {
        const { sut, encryptStub } = makeSut()
        const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    //test ignorado
    // it('should throw if encrypter throws', async () => {
    //     const { sut, encryptStub } = makeSut()
    //     jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    //     const accountData = {
    //         name: 'valid_name',
    //         email: 'valid_email',
    //         password: 'valid_password'
    //     }
    //     const promise = await sut.add(accountData)
    //     await expect(promise).rejects.toThrow()
    // })

}) 