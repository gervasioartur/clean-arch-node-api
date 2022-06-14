import { LogControllerDecorator } from "../../../main/decorators/log"
import { MissingParamError } from "../../../presentation/errors"
import { badRequest } from "../../../presentation/helpers/http-helper"
import { LoginController } from "./login"

interface SutTypes {
    sut: LoginController
}

const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return {
        sut
    }
}
describe('Login COntroller',() => {
    it('Should return 400 if no email is privided',async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('Should return 400 if no password is privided',async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@email.com"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
})