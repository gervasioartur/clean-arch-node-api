import { SurveyResultModel, SaveSurveyResultRepository, SaveSurveyResultParams,SaveSurveyResult } from './db-save-resul-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor (
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository
    ) {}
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        const survesyResult = await this.saveSurveyResultRepository.save(data)
        return survesyResult
    }
}