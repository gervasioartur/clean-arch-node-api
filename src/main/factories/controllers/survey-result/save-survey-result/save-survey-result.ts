import { Controller, makeLogControllerDecorator, SaveSurveyResultController, makeDbLoadSurveyById,makeDbSaveSurveyResult } from './save-survey-result-protocls'

export const makeSaveSurveyResultController = (): Controller => {
    const controller = new SaveSurveyResultController(makeDbLoadSurveyById(),makeDbSaveSurveyResult())
    return makeLogControllerDecorator(controller)
}