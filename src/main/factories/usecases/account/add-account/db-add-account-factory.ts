import { DbAddAccount } from '../../../../../data/useCases/add-account/db-add-acount'
import { BcryptAdapter } from '../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { AddAccount } from '../../../../../domain/useCases/add-account'

export const makeDbAdAccount = (): AddAccount => {
    const salt = 12
    const bcryptAdpter = new BcryptAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptAdpter, accountMongoRepository, accountMongoRepository)
}