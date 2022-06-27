import { SurveyModel } from "@/domain/models/survey"

export interface LoadSurveysByIdRepository {
    loadById(id: string): Promise<SurveyModel>
}
