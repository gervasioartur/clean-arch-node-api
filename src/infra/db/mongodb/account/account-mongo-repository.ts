import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AccountModel } from "../../../../domain/models/Account";
import { AddAccountModel } from "../../../../domain/useCases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/load-account-by-token-repository";
import { LoadAccountByIdRepository } from "../../../../data/protocols/db/account/load-account-by-id-repository";
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByIdRepository, LoadAccountByTokenRepository {
    async add (accountData: AddAccountModel): Promise<any> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        const result = await accountColleaction.insertOne(accountData)
        return result.insertedId
    }

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        const account = await accountColleaction.findOne({ email })
        return account && MongoHelper.map(account)
    }
    async loadByToken (token: any, role?: string): Promise<AccountModel> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        const account = await accountColleaction.findOne({
            accessToken: token,
            $or: [
                {
                    role
                }, {
                    role: 'admin'
                }]
        })
        return account && MongoHelper.map(account)
    }

    async loadById (id: any): Promise<AccountModel> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        const account = await accountColleaction.findOne({ _id: id })
        return account ? MongoHelper.map(account) : null
    }

    async updateAccessToken (id: any, token: string): Promise<void> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        await accountColleaction.updateOne(
            { _id: id },
            {
                $set: {
                    accessToken: token
                }
            })
    }
}
