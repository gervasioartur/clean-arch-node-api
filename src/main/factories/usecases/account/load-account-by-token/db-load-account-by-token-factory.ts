import env from '@/main/config/env'
import { LoadAccountByToken, JwtAdapter, AccountMongoRepository, DbLoadAccountBytoken } from './db-load-account-by-token-factory-protocols'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.secret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbLoadAccountBytoken(jwtAdapter, accountMongoRepository)
}