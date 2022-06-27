import { Controller, SingUpController, makeDbAdAccount, makeSinupValidation, makeDbAuthentication, makeLogControllerDecorator } from './singup-controler-factory-protocols'
export const makeSingUpController = (): Controller => {
    const controller = new SingUpController(makeDbAdAccount(), makeSinupValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(controller)
}