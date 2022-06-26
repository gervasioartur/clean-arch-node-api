import { Controller, HttpRequest, HttpResponse } from "../../../protocols";
import { LoadSurveys } from '../../../../domain/useCases/load-survey'
import { ok, serverError } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
    constructor (
        private readonly loadSurvey: LoadSurveys
    ) { }
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurvey.load()
            return ok(surveys)
        } catch (error) {
            return serverError(error)
        }
    }
}