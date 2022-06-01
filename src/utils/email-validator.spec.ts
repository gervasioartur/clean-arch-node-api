import { EmailValidatorAdapter } from "./email-validator"
import validator from 'validator';

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true
    }
})
)

describe('EmailValidator Adapater', () => {
    it('should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(validator, "isEmail").mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(false)
    })

    it('should return true if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(true)
    })
})