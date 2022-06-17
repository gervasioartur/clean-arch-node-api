import bcrypt, { compare } from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    },
    async compare (): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}
describe('bcrypt Adapter', () => {
    it('Should call hash  with correct value', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Should return a valid hash on hash success', async () => {
        const sut = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toBe('hash')
    })

    it('Should throw if hash throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow()
    })

    it('Should call compare  with correct value', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('Should return true when compare succeeds', async () => {
        const sut = makeSut()
        const hash = await sut.compare('any_value', 'any_hash')
        expect(hash).toBe(true)
    })

    it('Should return false when compare fails', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt,'compare').mockImplementationOnce(() => { return false })
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(false)
    })
    
    it('Should throw if comapre throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.compare('any_value', 'any_hash')
        await expect(promise).rejects.toThrow()
    })
})
