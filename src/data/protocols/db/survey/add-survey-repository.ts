import { AddSurveyModel } from "@/domain/useCases/survey/add-survey"

export interface AddSurveyRepository {
    add(surveyData: AddSurveyModel): Promise<void>
}
