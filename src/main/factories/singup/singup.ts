import { LogMongoRepository } from '../../../infra/db/mongodb/log-mongo-repository/log-mongo-repository';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { DbAddAccount } from '../../../data/useCases/add-account/db-add-acount'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository/account-mongo-repository";
import { SingUpController } from "../../../presentation/controllers/sing-up/singup"
import { LogControllerDecorator } from '../../decorators/log';
import { makeSinupValidation } from './singup-validation';

export const makeSingUpController = (): Controller => {
    const salt = 12
    const bcryptAdpter = new BcryptAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdpter, accountMongoRepository)
    const singUpController = new SingUpController(dbAddAccount, makeSinupValidation())
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(singUpController, logMongoRepository)
}