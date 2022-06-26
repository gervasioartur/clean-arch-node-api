import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { LoadSurveys } from '../../../../domain/useCases/load-survey'

export class LoadSurveysController implements Controller {
    constructor (
        private readonly loadSurvey: LoadSurveys
    ) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
         await this.loadSurvey.load()
        return new Promise(resolve => resolve(null))
    }
}