import { EmailValidation, Validation, EmailValidatorAdapter, RequedFieldValidation, ValidationComposite } from './login-controller-factory-protocols'

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}