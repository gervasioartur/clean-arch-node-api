import bcrypt, { hash } from 'bcrypt'
import { bcryptAdapter } from './bcrypt-adapter'

// jest.mock('bcrypt', () => {
//     async hash(): Promise<string> {
//         return new Promise(resolve => resolve('hash'))
//     }
// })

describe('bcrypt Adapter', () => {
    it('Should call bcrypt with correct value', async () => {
        const salt = 12
        const sut = new bcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Should return a hash on sucess', async () => {
        jest.spyOn(bcrypt, 'hash').mockImplementation((pass, salt) => pass)
        const salt = 12
        const sut = new bcryptAdapter(salt)
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('any_value')
    })
})