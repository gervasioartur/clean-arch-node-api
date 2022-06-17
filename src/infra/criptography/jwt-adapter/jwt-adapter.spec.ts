import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock('jsonwebtoken', () => ({
    async sign (): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    }
}))

describe('JwtAdapter', () => {
    it('should calls JwtAdapter sign with correct values',async () => {
        const sut = new JwtAdapter('secret')
        const singSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on sign succeds',async () => {
        const sut = new JwtAdapter('secret')
       const accesToken = await sut.encrypt('any_id')
        expect(accesToken).toBe('any_token')
    })
})