import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"

describe('LogController decorator', () => {
    it('should call controller handle', async () => {
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
        const controlerStub = new ControllerStub()
        const handleSpy = jest.spyOn(controlerStub, 'handle')
        const sut = new LogControllerDecorator(controlerStub)

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
})