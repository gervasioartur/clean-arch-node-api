import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSaveSurveyResultController } from "../factories/controllers/survey-result/save-survey-result/save-survey-result"
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
    router.put('/surveys/:surveyId/results',auth, adaptRoute(makeSaveSurveyResultController()))
}