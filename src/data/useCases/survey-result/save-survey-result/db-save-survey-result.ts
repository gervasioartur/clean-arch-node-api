import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/useCases/survey-result/save-survey-result"

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor (
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository
    ) {}
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        const survesyResult = await this.saveSurveyResultRepository.save(data)
        return survesyResult
    }
}