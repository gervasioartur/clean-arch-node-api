import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

describe('Validation Composite', () => {
    it('should return an error if any validation fails', () => {
        class ValidatioSTub implements Validation {
            validate (input: any): Error {
                return new MissingParamError('field')
            }
        }
        const validationStub = new ValidatioSTub()

        const sut = new ValidationComposite([validationStub])
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})