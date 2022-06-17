import { LogErrorRepository } from "../../data/protocols/db/log-error-repository"
import { ok, serverError } from "../../presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"
import { AccountModel } from "@/domain/models/Account"

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => resolve(ok(makefakeAccount())))
        }
    }
    return new ControllerStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makefakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError (stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}

interface SUtTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): any => {
    const controlerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controlerStub, logErrorRepositoryStub)
    return {
        sut,
        controlerStub,
        logErrorRepositoryStub
    }
}

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
}

describe('LogController decorator', () => {
    it('should call controller handle', async () => {
        const { sut, controlerStub } = makeSut()
        const handleSpy = jest.spyOn(controlerStub, 'handle')
        await sut.handle(makeFakeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })

    it('should return the same result if the controller', async () => {
        const { sut } = makeSut()
        await sut.handle(makeFakeRequest())
        const httResponse = await sut.handle(makeFakeRequest())
        expect(httResponse).toEqual(ok(makefakeAccount()))
    })

    it('should call logErrorRepository wuth correct error if controller returns a server error', async () => {
        const { sut, controlerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controlerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
        await sut.handle(makeFakeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})