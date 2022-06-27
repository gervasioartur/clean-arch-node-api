import { Controller, makeLogControllerDecorator, LoginController, makeDbAuthentication, makeLoginValidation } from './login-controller-factory-protocols'

export const makeLoginController = (): Controller => {
    const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
    return makeLogControllerDecorator(controller)
}