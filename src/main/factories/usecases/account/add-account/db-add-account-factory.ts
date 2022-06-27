import { AddAccount, BcryptAdapter, AccountMongoRepository, DbAddAccount } from './db-add-account-factory-protocols'
export const makeDbAdAccount = (): AddAccount => {
    const salt = 12
    const bcryptAdpter = new BcryptAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptAdpter, accountMongoRepository, accountMongoRepository)
}