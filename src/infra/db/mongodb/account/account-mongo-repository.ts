import { AccountModel, LoadAccountByEmailRepository, AddAccountRepository, UpdateAccessTokenRepository, LoadAccountByIdRepository, LoadAccountByTokenRepository, AddAccountParams, MongoHelper } from './account-mongo-repository-protocols'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByIdRepository, LoadAccountByTokenRepository {
    async add (accountData: AddAccountParams): Promise<any> {
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
        return account && MongoHelper.map(account)
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
