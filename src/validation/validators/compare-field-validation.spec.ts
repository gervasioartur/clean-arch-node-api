import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { CompareFiedsValidation } from "./compare-fields-validation"

const makeSut = (): CompareFiedsValidation => {
    return new CompareFiedsValidation('field', 'fieldToCompare')
}

describe('CompareField validation', () => {
    it('sould return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
       expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })

    it('sould not return if validation  sucess', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
       expect(error).toBeFalsy()
    })
})