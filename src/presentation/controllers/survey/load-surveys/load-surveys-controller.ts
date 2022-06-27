import { Controller,HttpRequest, HttpResponse, LoadSurveys, noContent, serverError, ok } from './load-surveys-controller-protocols'
export class LoadSurveysController implements Controller {
    constructor (
        private readonly loadSurvey: LoadSurveys
    ) { }
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurvey.load()            
            return surveys.length ? ok(surveys) : noContent() 
        } catch (error) {
            return serverError(error)
        }
    }
}