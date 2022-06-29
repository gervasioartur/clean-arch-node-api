import { SurveyResultModel } from "@/domain/models/survey-result";

export const mockSurveyResult = (): SurveyResultModel => (
    {
        id: 'any_id',
        accountId: 'any_account_id',
        surveyId: 'any_survey_id',
        question: 'any_question',
        answer: 'any_answer',
        date: new Date()
    }
)