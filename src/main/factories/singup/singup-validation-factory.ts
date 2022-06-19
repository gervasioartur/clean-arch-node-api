import { Validation } from '../../../presentation/protocols/validation';
import { RequedFieldValidation, ValidationComposite, CompareFiedsValidation, EmailValidation } from '../../../presentation/helpers/validators/';
import { EmailValidatorAdapter } from '../../../main/adapters/validators/email-validator-adapter';
export const makeSinupValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    validations.push(new CompareFiedsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}