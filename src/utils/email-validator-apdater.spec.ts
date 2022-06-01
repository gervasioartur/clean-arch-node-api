import { EmailValidatorAdapter } from "./email-validator-adapter"
import validator from 'validator';

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true
    }
})
)
const makeSUt = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapater', () => {
    it('should return false if validator returns false', () => {
        const sut = makeSUt()
        jest.spyOn(validator, "isEmail").mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(false)
    })

    it('should return true if validator returns false', () => {
        const sut = makeSUt()
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(true)
    })

    it('should call validator with correct email', () => {
        const sut = makeSUt()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@email.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com')
    })
})