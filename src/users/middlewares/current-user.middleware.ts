import { Injectable, NestMiddleware } from "@nestjs/common";
import {Request, Response, NextFunction} from 'express'
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global{
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}
//thứ tự chạy request > middleware > guard > interceptor
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usreService : UsersService){}

    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session  || {};

        if(userId) {
            const user= await this.usreService.findOne(userId);
            
            req.currentUser = user
        }

        next()

    }
}