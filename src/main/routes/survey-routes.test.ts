import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { app } from '../config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

describe('Login routes', () => {
    let surveysColletion: Collection
    let accountsColletion: Collection

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveysColletion = await MongoHelper.getCollection('surveys')
        await surveysColletion.deleteMany({})
        accountsColletion = await MongoHelper.getCollection('accounts')
        await accountsColletion.deleteMany({})
    })

    describe('POST /surveys', () => {
        it('should return 403 on add surveys without accessToken', async () => {
            const respo = await request(app)
                .post('/api/surveys')
                .send({
                    question: 'Question',
                    answers: [
                        {
                            image: 'image.png',
                            answer: 'Answer 1'
                        },
                        {
                            answer: 'Answer 1'
                        }
                    ]
                }
                )
                .expect(403)
        })

        it('should return 204 on add surveys with valid token', async () => {
            const password = await hash('123456', 12)
            const res = await accountsColletion.insertOne({
                name: 'usuario test',
                email: 'usuario@test.com',
                role: 'admin',
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
                .post('/api/surveys')
                .set('authorization', `Bear ${accessToken}`)
                .send({
                    question: 'Question',
                    answers: [
                        {
                            image: 'image.png',
                            answer: 'Answer 1'
                        },
                        {
                            answer: 'Answer 1'
                        }
                    ]
                }
                )
                .expect(204)
        })
    })
})  