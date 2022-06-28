import request from 'supertest'
import { app } from '../config/app'

describe('SaveSurvey routes', () => {
    describe('PUT /surveys/:surveysId/results', () => {
        it('should return 403 on save surveys result without accessToken', async () => {
            const respo = await request(app)
                .put('/api/surveys/:surveyId/results')
                .send({
                    answer: 'answer'
                }
                )
                .expect(403)
        })
    })
})  