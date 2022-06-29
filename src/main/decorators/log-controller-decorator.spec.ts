import { LogControllerDecorator } from './log-controller-decorator'
import { 
    ok, 
    Controller,
    serverError, 
    HttpRequest,
    HttpResponse, 
    mockAccountModel,
    LogErrorRepository,
    mockLogErrorRepository
} from './log-controller-decorator-protocols'

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => resolve(ok(mockAccountModel())))
        }
    }
    return new ControllerStub()
}

const mockRequest = (): HttpRequest => ({
    body: {
        name: "any_name",
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

interface SUtTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): any => {
    const controlerStub = makeController()
    const logErrorRepositoryStub = mockLogErrorRepository()
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
        await sut.handle(mockRequest())
        expect(handleSpy).toHaveBeenCalledWith(mockRequest())
    })

    it('should return the same result if the controller', async () => {
        const { sut } = makeSut()
        await sut.handle(mockRequest())
        const httResponse = await sut.handle(mockRequest())
        expect(httResponse).toEqual(ok(mockAccountModel()))
    })

    it('should call logErrorRepository wuth correct error if controller returns a server error', async () => {
        const { sut, controlerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controlerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
        await sut.handle(mockRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})