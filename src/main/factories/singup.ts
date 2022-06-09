import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { DbAddAccount } from '../../data/useCases/add-account/db-add-acount'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SingUpController } from "../../presentation/controllers/sing-up/singup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from '../decorators/log';

export const makeSingUpController = (): Controller => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdpter = new BcryptAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdpter, accountMongoRepository)
    const singUpController = new SingUpController(emailValidatorAdapter, dbAddAccount) 

    return new LogControllerDecorator(singUpController, null)
}