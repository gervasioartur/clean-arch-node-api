import { 
    Controller, 
    LoginController, 
    makeLoginValidation,
    makeDbAuthentication, 
    makeLogControllerDecorator
} from './login-controller-factory-protocols'

export const makeLoginController = (): Controller => {
    const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
    return makeLogControllerDecorator(controller)
}