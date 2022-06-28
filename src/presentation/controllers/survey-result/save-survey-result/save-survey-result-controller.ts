import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult , forbidden, InvalidParamError, serverError } from "./save-survey-result-controller.protocols"

export class SaveSurveyResultController implements Controller {
    constructor ( 
        private readonly loadSurveyById: LoadSurveyById,
        private readonly saveSurveyResult: SaveSurveyResult
    ) { }
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { surveyId } = httpRequest.params
            const accountId = httpRequest.accountId
            const { answer, question } = httpRequest.body
            const surveyById = await this.loadSurveyById.loadById(surveyId)
            if (surveyById) {
                const answers = surveyById.answers.map(a => a.answer)
                if (!answers.includes(answer)) {
                    return forbidden(new InvalidParamError('answer'))
                }
                await this.saveSurveyResult.save({ surveyId, accountId, date: new Date(), answer })
            } else {
                return forbidden(new InvalidParamError('surveyId'))
            }
            return null
        } catch (error) {
            return serverError(error)
        }
    }
}
