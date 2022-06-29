import { MongoHelper, SaveSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel } from './survey-result-mong-respository-protocols'
export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        const surveyresultColleaction = await MongoHelper.getCollection('surveysResults')
        let result = await surveyresultColleaction.findOneAndUpdate(
            {
                surveyId: data.surveyId,
                accountId: data.accountId
            },
            {
                $set: { answer: data.answer }
            },{
                upsert: true
            }
        )
        result = MongoHelper.map(result)
        const insertedOrUpdatedSurveyResultId = result.lastErrorObject.upserted || result.value._id
        const surveyResult = await surveyresultColleaction.findOne({ _id: insertedOrUpdatedSurveyResultId })
        return surveyResult && MongoHelper.map(surveyResult) 
    }
}