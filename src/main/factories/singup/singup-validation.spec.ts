import { Validation } from "../../../presentation/protocols/validation"
import { RequedFieldValidation } from "../../../presentation/helpers/validators/required-field-validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { makeSinupValidation } from "./singup-validation"
import { CompareFiedsValidation } from "../../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { EmailValidator } from "../../../presentation/protocols/email-validator"

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('SingupValidator', () => {
    it('should call ValidationComposito with all validations', () => {
        makeSinupValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequedFieldValidation(field)
            )
        }
        validations.push(new CompareFiedsValidation('password','passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})