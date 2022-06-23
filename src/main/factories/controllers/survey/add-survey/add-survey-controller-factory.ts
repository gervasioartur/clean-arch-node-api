import { Controller } from "../../../../../presentation/protocols"
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeAddSorveyValidation } from "./add-survey-validation-factory"
import { makeDbAddSurvey } from "../../../usecases/survey/add-survey/db-add-survey-factory"

export const makeAddSurveyController = (): Controller => {
    const controller = new AddSurveyController(makeAddSorveyValidation(),makeDbAddSurvey())
    return makeLogControllerDecorator(controller)
}