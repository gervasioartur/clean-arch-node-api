import { EmailValidatorAdapter, RequedFieldValidation, Validation, CompareFiedsValidation, EmailValidation, ValidationComposite } from './singup-controler-factory-protocols'

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