import { Controller } from "../../../../../presentation/protocols"
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurvey } from "../../../usecases/survey/load-survey/db-add-survey-factory"
import { LoadSurveysController } from "../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller"

export const makeLoadSurveyController = (): Controller => {
    const controller = new LoadSurveysController(makeDbLoadSurvey())
    return makeLogControllerDecorator(controller)
}