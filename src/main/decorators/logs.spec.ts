import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SUtTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
}

const makeCOntroller = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: 'Gervas'
                }
            }
            return new Promise(resolve => resolve(httpResponse))
        }
    }
    return new ControllerStub()
}

const makeSut = (): any => {
    const controlerStub = makeCOntroller()
    const sut = new LogControllerDecorator(controlerStub)
    return {
        sut,
        controlerStub
    }
}

describe('LogController decorator', () => {
    it('should call controller handle', async () => {
        const { sut, controlerStub } = makeSut()
        const handleSpy = jest.spyOn(controlerStub, 'handle')
        const httpRequest = {
            body: {
                name: "any_name",
                email: 'valid_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('should return the same result if the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: 'valid_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httResponse = await sut.handle(httpRequest)
        expect(httResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'Gervas'
            }
        })
    })
})