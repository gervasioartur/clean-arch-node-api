import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'

describe('Account Mongo repo', () => {
    let accountsColletion: Collection
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL || '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountsColletion = await MongoHelper.getCollection('accounts')
        await accountsColletion.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    describe('add()', () => {
        it('Shoul return an account id on add success', async () => {
            const sut = makeSut()
            const accountId = await sut.add({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            })
            expect(accountId).toBeTruthy()
        })
    })

    describe('loadByEmail()', () => {
        it('Shoud return an account on loadByEmail success', async () => {
            const sut = makeSut()
            await accountsColletion.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            })
            const account = await sut.loadByEmail('any_email@email.com')

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        it('Shoud return null if loadByEmail fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByEmail('any_email@email.com')
            expect(account).toBeFalsy()
        })
    })

    describe('loadByToken()', () => {
        it('Shoud return an account on loadByToken without role success', async () => {
            const sut = makeSut()
            await accountsColletion.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token'
            })
            const account = await sut.loadByToken('any_token')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        it('Shoud return an account on loadByToken with admin success', async () => {
            const sut = makeSut()
            await accountsColletion.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token',
                role: 'admin'
            })
            const account = await sut.loadByToken('any_token', 'admin')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        it('Shoud return null on loadByToken with invalid role', async () => {
            const sut = makeSut()
            await accountsColletion.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token'
            })
            const account = await sut.loadByToken('any_token', 'admin')
            expect(account).toBeFalsy()
        })

        // it('Shoud return an account on loadByToken if user  is admin', async () => {
        //     const sut = makeSut()
        //     await accountsColletion.insertOne({
        //         name: 'any_name',
        //         email: 'any_email@email.com',
        //         password: 'any_password',
        //         accessToken: 'any_token',
        //         role: 'admin'
        //     })
        //     const account = await sut.loadByToken('any_token')
        //     expect(account).toBeTruthy()
        //     expect(account.id).toBeTruthy()
        //     expect(account.name).toBe('any_name')
        //     expect(account.email).toBe('any_email@email.com')
        //     expect(account.password).toBe('any_password')
        // })

        it('Shoud return null if loadByToken fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByToken('any_token')
            expect(account).toBeFalsy()
        })
    })

    describe('loadById()', () => {
        it('Shoud return an account on loadById success', async () => {
            const sut = makeSut()
            const accountId = await accountsColletion.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            })

            const account = await sut.loadById(accountId.insertedId)
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        it('Shoud return null if loadById fails', async () => {
            const sut = makeSut()
            const account = await sut.loadById('any_email@email.com')
            expect(account).toBeFalsy()
        })
    })

    describe('updateAccessToken()', () => {
        it('Should update the account accessToken  on updateAccesToken success', async () => {
            const sut = makeSut()
            const accoutId = await accountsColletion.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            })
            await sut.updateAccessToken(accoutId.insertedId, 'any_token')
            const account = await accountsColletion.findOne({ _id: accoutId.insertedId })
            expect(account).toBeTruthy()
            expect(account?.accessToken).toBe('any_token')
        })
    })
})
