import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { app } from '../config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Login routes', () => {
    let accountsColletion: Collection
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountsColletion = await MongoHelper.getCollection('accounts')
        await accountsColletion.deleteMany({})
    })

    describe('POST /singup', () => {
        it('should return 200 on singup', async () => {
            const respo = await request(app)
                .post('/api/singup')
                .send({
                    name: 'usuario test',
                    email: 'usuario@test.com',
                    password: '123456',
                    passwordConfirmation: '123456'
                })
                .expect(200)
        })
    })

    describe('POST /login', () => {
        it('should return 200 on login', async () => {
            const password = await hash('123456', 12)
            await accountsColletion.insertOne({
                name: 'usuario test',
                email: 'usuario@test.com',
                password
            })
            const respo = await request(app)
                .post('/api/login')
                .send({
                    email: 'usuario@test.com',
                    password: '123456'
                })
                .expect(200)
        })

        it('should return 401 on login', async () => {
            const respo = await request(app)
                .post('/api/login')
                .send({
                    email: 'usuario@test.com',
                    password: '123456'
                })
                .expect(401)
        })
    })
})  