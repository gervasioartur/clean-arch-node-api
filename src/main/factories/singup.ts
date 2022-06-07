import { DbAddAccount } from '../../data/useCases/add-account/db-add-acount'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import {SingUpController } from "../../presentation/controllers/sing-up/sing-up"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSingUpControler = () : SingUpController => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdpter =  new BcryptAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdpter, accountMongoRepository)
    return new SingUpController(emailValidatorAdapter, dbAddAccount)
}