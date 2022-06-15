import { Validation } from "../../presentation/helpers/validators/validation"
import { RequedFieldValidation } from "../../presentation/helpers/validators/required-field-validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { makeSinupValidation } from "./singup-validation"

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SingupValidator', () => {
    it('should call ValidationComposito with all validations', () => {
        makeSinupValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequedFieldValidation(field)
            )
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})