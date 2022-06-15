import { Validation } from '../../presentation/helpers/validators/validation';
import { RequedFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
export const makeSinupValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['name', 'email','password', 'passwordConfirmation']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    return new ValidationComposite(validations)
}