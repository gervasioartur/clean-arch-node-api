import { hash } from 'bcrypt'
import Mockdate from 'mockdate'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import { app } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

describe('SaveSurvey routes', () => {
    let surveysColletion: Collection
    let accountsColletion: Collection

    beforeAll(async () => {
        Mockdate.set(new Date())
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        Mockdate.reset()
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveysColletion = await MongoHelper.getCollection('surveys')
        await surveysColletion.deleteMany({})
        accountsColletion = await MongoHelper.getCollection('accounts')
        await accountsColletion.deleteMany({})
    })

    describe('PUT /surveys/:surveysId/results', () => {
        it('should return 403 on save surveys result without accessToken', async () => {
            const respo = await request(app)
                .put('/api/surveys/:surveyId/results')
                .send({ answer: 'answer' })
                .expect(403)
        })

        it('should return 200 on save survey result with accessToken', async () => {
            const restult = await surveysColletion.insertOne({
                question: 'Question',
                answers: [
                    {
                        image: 'image.png',
                        answer: 'Answer 1'
                    },
                    {
                        answer: 'Answer 2'
                    }
                ],
                date: new Date()
            })
            const password = await hash('123456', 12)
            const res = await accountsColletion.insertOne({
                name: 'usuario survey save test',
                email: 'usuario@test.com',
                password
            })

            const id = res.insertedId
            const accessToken = sign({ id }, env.secret)
            await accountsColletion.updateOne({
                _id: id
            }, {
                $set: {
                    accessToken
                }
            })

            const respo = await request(app)
                .put(`/api/surveys/${restult.insertedId}/results`)
                .set('authorization', `Bear ${accessToken}`)
                .send({ answer: 'Answer 1' })
                .expect(200)
        })
    })
})  