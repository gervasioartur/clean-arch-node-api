import request from "supertest"
import { app } from "@/main/config/app"

describe('Cors middleaware', () => {
    it('should enable cors',async () => {
        app.get('/test_cors', (req, res) => {
            res.send(req.body)
        })
        await request(app)
            .get('/test_cors')
            .send({ name: 'Gervasio' })
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*')
    })
})