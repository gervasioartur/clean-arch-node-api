import { AddAccountModel } from "../../domain/useCases/add-account"
import { AccountModel } from '../../domain/models/Account'

export interface AddAccountRepository {
    add: (accountData: AddAccountModel) => Promise<AccountModel>
}
