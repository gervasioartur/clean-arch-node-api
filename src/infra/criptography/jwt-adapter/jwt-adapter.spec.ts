import { throwError } from "@/domain/test"
import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock('jsonwebtoken', () => ({
    async sign (): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    }, 
    async verify (): Promise<string> {
        return new Promise(resolve => resolve('any_value'))
    }
}))

const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {
    describe('sing()', () => {
        it('should calls JwtAdapter sign with correct values', async () => {
            const sut = makeSut()
            const singSpy = jest.spyOn(jwt, 'sign')
            await sut.encrypt('any_id')
            expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
        })

        it('should return a token on sign succeds', async () => {
            const sut = makeSut()
            const accesToken = await sut.encrypt('any_id')
            expect(accesToken).toBe('any_token')
        })

        it('should  throws if sign  throws', async () => {
            const sut = makeSut()
            jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)
            const promise = sut.encrypt('any_id')
            await expect(promise).rejects.toThrow()
        })
    })

    describe('verify()', () => {
        it('should calls Verify sign with correct values', async () => {
            const sut = makeSut()
            const verifySpy = jest.spyOn(jwt, 'verify')
            await sut.decrypt('any_token')
            expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
        })

        it('should retun a value on success', async () => {
            const sut = makeSut()
            const value = await sut.decrypt('any_token')
            expect(value).toBe('any_value')
        })
    })
})