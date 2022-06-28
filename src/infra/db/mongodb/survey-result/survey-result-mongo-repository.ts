import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/useCases/survey-result/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "../survey/survey-mongo-repository";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
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