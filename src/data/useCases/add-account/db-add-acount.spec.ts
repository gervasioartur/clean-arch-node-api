import { Encrypter } from "@/data/protocol/encrypter"
import { DbAddAccount } from "./db-add-acount"
interface SuTypes {
    sut: DbAddAccount
    encryptStub: Encrypter
}
const makeSut = (): SuTypes => {
    class EncryptStub {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hasehed_password'))
        }
    }

    const encryptStub = new EncryptStub()
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
            email: 'valid_emai',
            password: 'valid_passwordI'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_passwordI')
    })
})