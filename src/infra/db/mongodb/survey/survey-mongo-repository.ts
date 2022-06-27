import { MongoHelper, AddSurvey, AddSurveyRepository, AddSurveyModel, LoadSurveysRepository, SurveyModel } from './survey-mong-repository-protocols'

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
