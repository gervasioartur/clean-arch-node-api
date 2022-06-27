import { Controller, HttpRequest, HttpResponse, LogErrorRepository } from './log-controller-decorator-protocols'

export class LogControllerDecorator implements Controller {
    constructor (
        private readonly controller: Controller,
        private readonly logErrorRepository: LogErrorRepository
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)
        if (httpResponse.statusCode === 500) {
            await this.logErrorRepository.logError(httpResponse.body.stack)
        }
        return httpResponse
    }
}