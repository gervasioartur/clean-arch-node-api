import { Controller } from '../../../../presentation/protocols';
import { SingUpController } from "../../../../presentation/controllers/authentication/sing-up/singup-controller"
import { makeSinupValidation } from './singup-validation-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-athentication-factory';
import { makeDbAdAccount } from '../../usecases/add-account/db-add-account-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeSingUpController = (): Controller => {
    const controller = new SingUpController(makeDbAdAccount(), makeSinupValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(controller)
}