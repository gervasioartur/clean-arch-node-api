import { MongoHelper, SurveyMongoRepository } from '../survey/survey-mong-repository-protocols'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

import { Collection, ObjectId } from 'mongodb'
import { AccountMongoRepository } from '../account/account-mongo-repository'

let surveyColletion: Collection
let surveyResultColletion: Collection
let accountColletion: Collection

const makeSurveyMongoRepository = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
}

const makeAccountMongoRepository = (): AccountMongoRepository => {
    return new AccountMongoRepository()
}

const makeSurvey = async (): Promise<ObjectId> => {
    const res = await surveyColletion.insertOne({
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            },
            {
                answer: 'any_answer_2'
            }
        ],
        date: new Date()
    })
    return res.insertedId
}

const makeSurveyResult = async (accountId, surveyId, answer): Promise<void> => {
    const res = await surveyResultColletion.insertOne(
        {
            surveyId: surveyId,
            accountId: accountId,
            answer
        }
    )
}

const makeAccount = async (): Promise<ObjectId> => {
    const res = await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
    })
    return res.insertedId
}

const makeSut = (): SurveyResultMongoRepository => {
    const surveyMongRepositoryStub = makeSurveyMongoRepository()
    return new SurveyResultMongoRepository(surveyMongRepositoryStub)
}

describe('Survey Mongo repo', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL || '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyColletion = await MongoHelper.getCollection('surveys')
        await surveyColletion.deleteMany({})

        surveyResultColletion = await MongoHelper.getCollection('surveysResults')
        await surveyResultColletion.deleteMany({})

        accountColletion = await MongoHelper.getCollection('accounts')
        await accountColletion.deleteMany({})
    })

    describe('save()', () => {
        it('should add survey if  its new', async () => {
            const sut = await makeSut()
            const surveyId = await makeSurvey()
            const accountId = await makeAccount()

            const sutSurveyMongoRepository = makeSurveyMongoRepository()
            const surveyById = await sutSurveyMongoRepository.loadById(surveyId)

            const sutAccountMongoRepository = makeAccountMongoRepository()
            const accountById = await sutAccountMongoRepository.loadById(accountId)

            const surveyResult = await sut.save({ surveyId: surveyById.id, accountId: accountById.id, question: surveyById.question, answer: surveyById.answers[0].answer, date: new Date() })
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.accountId).toEqual(accountId)
            expect(surveyResult.surveyId).toEqual(surveyId)
        })

        it('should update survey if exists', async () => {
            const sut = await makeSut()
            const surveyId = await makeSurvey()
            const accountId = await makeAccount()

            const sutSurveyMongoRepository = makeSurveyMongoRepository()
            const surveyById = await sutSurveyMongoRepository.loadById(surveyId)

            const sutAccountMongoRepository = makeAccountMongoRepository()
            const accountById = await sutAccountMongoRepository.loadById(accountId)

            await makeSurveyResult(accountId, surveyId, surveyById.answers[0].answer)
            const surveyResult = await sut.save({ surveyId: surveyById.id, accountId: accountById.id, question: surveyById.question, answer: 'updated_answer', date: new Date() })
            
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.accountId).toEqual(accountId)
            expect(surveyResult.surveyId).toEqual(surveyId)
            expect(surveyResult.answer).toEqual('updated_answer')
        })
    })
})