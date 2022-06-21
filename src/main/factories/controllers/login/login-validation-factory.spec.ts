import { Validation } from "../../../../presentation/protocols/validation"
import { RequedFieldValidation, ValidationComposite, EmailValidation } from "../../../../validation/validators/"
import { makeLoginValidation } from "./login-validation-factory"
import { EmailValidator } from "../../../../validation/protocols/email-validator"

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('LoginValidator', () => {
    it('should call ValidationComposito with all validations', () => {
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