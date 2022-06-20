import { AccountModel } from '../../../../domain/models/Account'

export interface LoadAccountByIdRepository{
    loadById (accountId: any): Promise<AccountModel> | null
}