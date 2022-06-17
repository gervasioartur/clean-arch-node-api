import { Validation } from "../../../../presentation/protocols/validation"
import { RequedFieldValidation } from "../../../../presentation/helpers/validators/required-field-validation"
import { ValidationComposite } from "../../../../presentation/helpers/validators/validation-composite"
import { makeLoginValidation } from "./login-validation"
import { EmailValidation } from "../../../../presentation/helpers/validators/email-validation"
import { EmailValidator } from "../../../../presentation/protocols/email-validator"

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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