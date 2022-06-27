import { SaveSurveyResultRepository } from "@/data/protocols/db/survey/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResult, SaveSurveyResultModel } from "@/domain/useCases/save-survey-result";

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor (
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository
    ) {}
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const survesyResult = await this.saveSurveyResultRepository.save(data)
        return survesyResult
    }
}