import { AddAccountRepository } from "@/data/protocols/add-account-repository";
import { AccountModel } from "@/domain/models/Account";
import { AddAccountModel } from "@/domain/useCases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountColleaction = MongoHelper.getCollection('accounts')
        const result = await accountColleaction.insertOne(accountData)
        return MongoHelper.map(result.ops[0])
    }
}