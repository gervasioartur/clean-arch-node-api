import { Router } from "express";
import { makeSaveSurveyResultController } from "@/main/factories/controllers/survey-result/save-survey-result/save-survey-result"
import { adaptRoute } from "@/main/adapters/express-routes-adapter";
import { auth } from "@/main/middlewares/auth";

export default (router: Router): void => {
    router.put('/surveys/:surveyId/results',auth, adaptRoute(makeSaveSurveyResultController()))
}