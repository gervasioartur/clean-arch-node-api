import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { Collection } from 'mongodb'

describe('Account Mongo repo', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('Shoul return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })

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

  it('Shoud return null if loadByEmail fals', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeFalsy()
  })

  it('Should update the account accessToken  on updateAccesToken success', async () => {
    const sut = makeSut()
    const res = await accountsColletion.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    const fakeAccount = res.ops[0]
    expect(fakeAccount.ccessToken).toBeFalsy()
    await sut.updateAccessToken(fakeAccount._id, 'any_token')
    const account = await accountsColletion.findOne({ _id: fakeAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
