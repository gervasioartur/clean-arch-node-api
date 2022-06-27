import { AddSurveyModel } from "@/domain/useCases/add-survey"

export interface AddSurveyRepository {
    add(surveyData: AddSurveyModel): Promise<void>
}
