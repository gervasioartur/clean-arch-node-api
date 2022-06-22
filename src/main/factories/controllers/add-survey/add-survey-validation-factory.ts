import { Validation } from '../../../../presentation/protocols/validation';
import { ValidationComposite, RequedFieldValidation } from '../../../../validation/validators';

export const makeAddSorveyValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
        validations.push(new RequedFieldValidation(field)
        )
    }
    return new ValidationComposite(validations)
}