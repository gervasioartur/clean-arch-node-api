import { 
    Validation, 
    EmailValidation, 
    mockEmailValidator,
    ValidationComposite,
    makeLoginValidation, 
    RequedFieldValidation
} from './login-controller-factory-protocols'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidator', () => {
    it('should call ValidationCompositor with all validations', () => {
        makeLoginValidation()
        const validations: Validation[] = []
        for (const field of ['email', 'password']) {
            validations.push(new RequedFieldValidation(field)
            )
        }
        validations.push(new EmailValidation('email', mockEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})