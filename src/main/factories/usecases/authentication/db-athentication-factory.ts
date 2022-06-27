import { Authentication, BcryptAdapter, AccountMongoRepository, DbAuthentication, JwtAdapter } from './db-athentication-factory-protocols'
import env from '@/main/config/env'

export const makeDbAuthentication = (): Authentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const jwtAdapter = new JwtAdapter(env.secret)
    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}