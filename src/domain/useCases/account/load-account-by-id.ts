import { AccountModel } from "@/domain/models/Account"

export interface LoadAccountById {
    load (accountId: any): Promise<AccountModel>
}
