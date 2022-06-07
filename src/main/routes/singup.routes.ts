import { Router } from "express";
import {makeSingUpControler} from '../factories/singup'
import { adaptRoute } from "../adapters/express-routes-adapter";

export default  (router: Router): void => {
    router.post('/singup', adaptRoute(makeSingUpControler()))
}