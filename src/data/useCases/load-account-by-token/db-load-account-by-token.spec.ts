import { LoadAccountByToken, Decrypter, AccountModel } from './db-load-account-protocols'
import { DbLoadAccountBytoken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        async decrypt (accessToken: string): Promise<string> {
            return new Promise(resolve => resolve('any_id'))
        }
    }
    return new DecrypterStub()
}

interface SutTypes {
    sut: DbLoadAccountBytoken
    decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypter()
    const sut = new DbLoadAccountBytoken(decrypterStub)

    return {
        sut,
        decrypterStub
    }
}

describe('DbLoadAccountByToken', () => {
    it('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    it('should return null if Decrypter retuns null', async () => {
        const { sut, decrypterStub } = makeSut()
       jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load('any_token','any_role')
        expect(account).toBeNull()
    })
})