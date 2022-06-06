import request from "supertest"
import { app } from "../config/app"

describe('Contet-type middleaware', () => {
    it('shoud return default content type as json',async () => {
        app.get('/test_content_type', (req, res) => {
            res.send('')
        })
        await request(app)
            .get('/test_content_type')
           .expect('content-type', /json/)
    })
})