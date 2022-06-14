import { LogControllerDecorator } from "../../../main/decorators/log"
import { MissingParamError } from "../../../presentation/errors"
import { badRequest } from "../../../presentation/helpers/http-helper"
import { LoginController } from "./login"

describe('Login COntroller',() => {
    it('Should return 400 if no email is privider',async () => {
        const sut = new LoginController()
        const httpRequest = {
            body: {
                password: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
})