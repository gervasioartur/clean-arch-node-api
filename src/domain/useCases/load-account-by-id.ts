import { AccountModel } from "../models/Account";

export interface LoadAccountById {
    load (accountId: any): Promise<AccountModel>
}
