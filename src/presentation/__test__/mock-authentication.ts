import { Authentication, AuthenticationParams } from "@/presentation/controllers/authentication/login/login-controller-protocols"

export const mockAuthentication = (): Authentication => {
    class AuthenticatioStub implements Authentication {
        async auth (Authentication: AuthenticationParams): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticatioStub()
}