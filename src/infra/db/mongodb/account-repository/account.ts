import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AccountModel } from "@/domain/models/Account";
import { AddAccountModel } from "@/domain/useCases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        const result = await accountColleaction.insertOne(accountData)
        return MongoHelper.map(result.ops[0])
    }

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountColleaction = await MongoHelper.getCollection('accounts')
        const account = await accountColleaction.findOne({ email })
        return account && MongoHelper.map(account)
    }
}
