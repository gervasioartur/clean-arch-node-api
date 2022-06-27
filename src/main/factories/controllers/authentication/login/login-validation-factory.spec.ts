import { EmailValidation, makeLoginValidation, EmailValidator, Validation, RequedFieldValidation, ValidationComposite } from './login-controller-factory-protocols'
jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('LoginValidator', () => {
    it('should call ValidationCompositor with all validations', () => {
        makeLoginValidation()
        const validations: Validation[] = []
        for (const field of ['email', 'password']) {
            validations.push(new RequedFieldValidation(field)
            )
        }
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})