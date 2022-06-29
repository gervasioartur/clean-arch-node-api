import { 
    Validation, 
    EmailValidation, 
    mockEmailValidator,
    ValidationComposite, 
    makeSinupValidation, 
    RequedFieldValidation, 
    CompareFiedsValidation
} from './singup-controler-factory-protocols'

jest.mock('@/validation/validators/validation-composite')

describe('SingupValidator', () => {
    it('should call ValidationCompositor with all validations', () => {
        makeSinupValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequedFieldValidation(field)
            )
        }
        validations.push(new CompareFiedsValidation('password','passwordConfirmation'))
        validations.push(new EmailValidation('email', mockEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})