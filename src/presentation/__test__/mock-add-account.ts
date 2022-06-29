import { AccountModel, AddAccount, AddAccountParams } from "@/presentation/controllers/authentication/sing-up/singup-controller-protoccols"
import { mockAccountModel } from "@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols"

export const mockAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountParams): Promise<AccountModel> {
            return new Promise(resolve => resolve(mockAccountModel()))
        }
    }
    return new AddAccountStub()
}