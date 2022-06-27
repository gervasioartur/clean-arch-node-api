import { Validation, ValidationComposite, RequedFieldValidation } from './add-survey-controller-factory-protocols'

export const makeAddSorveyValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    return new ValidationComposite(validations)
}