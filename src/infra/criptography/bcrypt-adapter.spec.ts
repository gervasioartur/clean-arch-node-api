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
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Should return a hash on sucess', async () => {
        const sut = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toBe('hash')
    })

    it('Should throw if bcrypt throws', async () => {
        const sut = makeSut()
        // eslint-disable-next-line no-multi-spaces
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow()
    })
})
