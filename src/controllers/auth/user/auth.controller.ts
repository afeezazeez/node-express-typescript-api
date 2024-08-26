import {  Request, Response, NextFunction } from 'express';
export class AuthController {

    async register(req: Request, res: Response,next:NextFunction): Promise<Response> {
        return res.send("done");
    }

}
