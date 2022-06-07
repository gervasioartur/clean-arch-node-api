import { Controller, HttpRequest,HttpResponse } from "@/presentation/protocols";
import { Request,Response } from "express";

export const adaptRoute = (controler: Controller) => {
    return async (req:Request,res:Response) => {
        const httpRequest  = {
            body: req.body
        }
      const httpResponse =  await controler.handle(httpRequest)
      res.status(200).json(httpResponse.body)
    }
} 