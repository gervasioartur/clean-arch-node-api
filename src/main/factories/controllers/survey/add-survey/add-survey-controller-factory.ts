import { 
    Controller, 
    makeDbAddSurvey, 
    AddSurveyController, 
    makeAddSorveyValidation, 
    makeLogControllerDecorator
} from './add-survey-controller-factory-protocols'

export const makeAddSurveyController = (): Controller => {
    const controller = new AddSurveyController(makeAddSorveyValidation(),makeDbAddSurvey())
    return makeLogControllerDecorator(controller)
}