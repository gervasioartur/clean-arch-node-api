import { 
    Validation,
    ValidationComposite,
    RequedFieldValidation, 
    makeAddSorveyValidation
} from './add-survey-controller-factory-protocols'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidationFactory', () => {
    it('should call ValidationCompositor with all validations', () => {
        makeAddSorveyValidation()
        const validations: Validation[] = []
        for (const field of ['question', 'answers']) {
            validations.push(new RequedFieldValidation(field)
            )
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})