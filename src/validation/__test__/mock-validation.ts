import { Validation } from "@/presentation/protocols"

export const mockValidation = (): Validation => {
    class ValidatioSTub implements Validation {
        validate (input: any): Error | null {
            return null
        }
    }
    return new ValidatioSTub()
}