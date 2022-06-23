import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock('jsonwebtoken', () => ({
    async sign (): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    }
}))

const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {
    describe('sing()', () => {
    it('should calls JwtAdapter sign with correct values',async () => {
        const sut = makeSut()
        const singSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on sign succeds',async () => {
        const sut = makeSut()
        const accesToken = await sut.encrypt('any_id')
        expect(accesToken).toBe('any_token')
    })

    it('should JwtAdapter throws if sign  throws',async () => {
        const sut = makeSut()
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.encrypt('any_id')
        await expect(promise).rejects.toThrow()
    })
    })
})