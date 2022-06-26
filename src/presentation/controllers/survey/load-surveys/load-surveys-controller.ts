import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { LoadSurveys } from '../../../../domain/useCases/load-survey'
import { ok } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
    constructor (
        private readonly loadSurvey: LoadSurveys
    ) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const surveys = await this.loadSurvey.load()
        return ok(surveys)
    }
}