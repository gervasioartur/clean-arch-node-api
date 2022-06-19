import { Validation } from '../../../presentation/protocols/validation';
import { ValidationComposite, RequedFieldValidation, EmailValidation } from '../../../presentation/helpers/validators/';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}