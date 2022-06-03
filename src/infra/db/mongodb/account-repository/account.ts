import { AddAccountRepository } from "@/data/protocols/add-account-repository";
import { AccountModel } from "@/domain/models/Account";
import { AddAccountModel } from "@/domain/useCases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountColleaction = MongoHelper.getCollection('account')
        const result = await accountColleaction.insertOne(accountData)
        const account = result.ops[0]
        const { _id, ...accountWithoutId } = account
        return Object.assign({}, accountWithoutId, { id: _id })
    }
}