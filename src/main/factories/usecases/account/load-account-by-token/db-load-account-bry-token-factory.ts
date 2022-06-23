import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByToken } from '../../../../../domain/useCases/load-account-by-token'
import { DbLoadAccountBytoken } from '../../../../../data/useCases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.secret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbLoadAccountBytoken(jwtAdapter, accountMongoRepository)
}