import { AddSurveyModel } from "../../../../domain/useCases/add-survey";
import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-survey-repository";
import { SurveyModel } from "@/domain/models/survey";
import { resolve } from "path";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        await surveyColleaction.insertOne(surveyData)
    }
    async loadAll (): Promise<SurveyModel[]> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        const result = await surveyColleaction.find().toArray()
        const surveys = []
        for (let element of result) {
            element = MongoHelper.map(element)
            surveys.push(element)
        }
        return surveys
    }
}
