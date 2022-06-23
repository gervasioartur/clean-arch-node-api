import { Validation } from '../../../../../presentation/protocols/validation';
import { ValidationComposite, RequedFieldValidation, EmailValidation } from '../../../../../validation/validators';
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}