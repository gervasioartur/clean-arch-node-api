import { Controller, LoadSurveysController, makeDbLoadSurvey, makeLogControllerDecorator } from './load-surveys-controller-facotory-protocols'

export const makeLoadSurveyController = (): Controller => {
    const controller = new LoadSurveysController(makeDbLoadSurvey())
    return makeLogControllerDecorator(controller)
}