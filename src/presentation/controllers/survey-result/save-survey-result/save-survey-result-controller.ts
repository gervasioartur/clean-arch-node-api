import { Controller, HttpRequest, HttpResponse, LoadSurveyById, forbidden, InvalidParamError } from "./save-survey-result-controller.protocols"

export class SaveSurveyResultController implements Controller {
    constructor (
        private readonly loadSurveyById: LoadSurveyById
    ) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const { surveyId } = httpRequest.params
        const surveyById = await this.loadSurveyById.loadById(surveyId)
        if (!surveyById) {
            return forbidden(new InvalidParamError('surveyId'))
        }
        return null
    }
}
