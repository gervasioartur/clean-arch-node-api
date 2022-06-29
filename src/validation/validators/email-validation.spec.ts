import { throwError } from '@/domain/__test__'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { mockEmailValidator } from '../__test__'
import { EmailValidation } from './email-validation'

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = mockEmailValidator()
    const sut = new EmailValidation('email', emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('Email validation', () => {
    it('should call return invalid email provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'email' })
        expect(error).toEqual(new InvalidParamError('email'))
    })

    it('should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpResponse = sut.validate({ email: 'any_email@email.com' })
        expect(isValidSpy).toHaveBeenLastCalledWith('any_email@email.com')
    })

    it('should retun throws if  EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(throwError)
        expect(sut.validate).toThrow()
    })
})