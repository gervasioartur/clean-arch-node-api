import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

describe('JwtAdapter', () => {
    it('should calls JwtAdapter sign with correct values',async () => {
        const sut = new JwtAdapter('secret')
        const singSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
})