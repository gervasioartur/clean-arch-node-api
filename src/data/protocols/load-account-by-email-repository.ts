import { AccountModel } from "../useCases/add-account";

export interface LoadAccountByEmailRepository{
    load (email: string): Promise<AccountModel>
}