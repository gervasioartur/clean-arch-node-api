import request from "supertest"
import { app } from "../config/app"

describe('Body parser middleaware', () => {
    it('should parse cors as body json', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send(req.body)
        })
        await request(app)
            .post('/test_body_parser')
            .send({ name: 'Gervasio' })
            .expect({ name: 'Gervasio' })
    })
})