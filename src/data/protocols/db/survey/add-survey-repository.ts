import { AddSurveyParams } from "@/domain/useCases/survey/add-survey"

export interface AddSurveyRepository {
    add(surveyData: AddSurveyParams): Promise<void>
}
