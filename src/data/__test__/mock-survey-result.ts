import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository"
import { mockSurveyResult, SaveSurveyResultParams, SurveyResultModel } from "@/data/useCases/survey-result/save-survey-result/db-save-resul-protocols"

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(mockSurveyResult()))
        }
    }
    return new SaveSurveyResultRepositoryStub()
}