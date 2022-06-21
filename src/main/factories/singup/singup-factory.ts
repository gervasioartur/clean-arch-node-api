import env from '../../config/env'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { Controller } from '../../../presentation/protocols';
import { DbAddAccount } from '../../../data/useCases/add-account/db-add-acount'
import { DbAuthentication } from '../../../data/useCases/authentication/db-authencation'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { SingUpController } from "../../../presentation/controllers/sing-up/singup-controller"
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSinupValidation } from './singup-validation-factory';

export const makeSingUpController = (): Controller => {
    const salt = 12
    const bcryptAdpter = new BcryptAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    const bcryptAdapter = new BcryptAdapter(salt)
    const dbAddAccount = new DbAddAccount(bcryptAdpter, accountMongoRepository)
    const jwtAdapter = new JwtAdapter(env.secret)
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
    const singUpController = new SingUpController(dbAddAccount, makeSinupValidation(), dbAuthentication)
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(singUpController, logMongoRepository)
}