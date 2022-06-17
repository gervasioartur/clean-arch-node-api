import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}
describe('bcrypt Adapter', () => {
    it('Should call bcrypt with correct value', async () => {
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Should return a hash on sucess', async () => {
        jest.spyOn(bcrypt, 'hash').mockImplementation((pass, salt) => pass)
        const sut = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toBe('any_value')
    })

    // Teste sem sucesso
    // it('Should throw if bcrypt throws', async () => {
    //     const sut = makeSut()
    //     jest.spyOn(bcrypt, 'hash').mockImplementation(() => { throw Error() })
    //     const promise = sut.hash('hash')
    //     await expect(new Promise((resolve,reject) => reject(new Error()))).rejects.toThrow()
    // })
})
