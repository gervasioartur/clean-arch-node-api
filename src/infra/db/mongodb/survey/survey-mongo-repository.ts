import { AddSurveyModel } from "../../../../domain/useCases/add-survey";
import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        await surveyColleaction.insertOne(surveyData)
    }
}
