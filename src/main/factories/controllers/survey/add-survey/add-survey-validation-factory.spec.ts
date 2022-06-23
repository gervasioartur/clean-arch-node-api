import { Validation } from "../../../../../presentation/protocols/validation"
import { RequedFieldValidation, ValidationComposite } from "../../../../../validation/validators"
import { makeAddSorveyValidation } from "./add-survey-validation-factory"

jest.mock('../../../../../validation/validators/validation-composite')

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