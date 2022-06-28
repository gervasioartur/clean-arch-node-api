import { SaveSurveyResultRepository } from "@/data/protocols/db/survey/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/useCases/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";
import { SurveyMongoRepository } from "../survey/survey-mongo-repository";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    constructor (
        private readonly surveyMongRepository: SurveyMongoRepository
    ) { }
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyresultColleaction = await MongoHelper.getCollection('surveysResults')
        let result = await surveyresultColleaction.findOneAndUpdate(
            {
                surveyId: data.surveyId,
                accountId: data.accountId
            },
            {
                $set: { answer: data.answers }
            },{
                upsert: true
            }
        )
        result = MongoHelper.map(result)
        const surveyResult = await surveyresultColleaction.findOne({ _id: result.lastErrorObject.upserted })
        return surveyResult ? MongoHelper.map(surveyResult) : null
    }
}