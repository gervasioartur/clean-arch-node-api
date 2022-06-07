import request from 'supertest'
import {app} from '../config/app'

describe('Sing up routes', ()=>{
    it('should return an account on sucess', async ()=>{
        await request(app)
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