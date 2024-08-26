import { 
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private usersService: UsersService){}

    async intercept(context: ExecutionContext, handle: CallHandler<any>){
        console.log("Đã vào => CurrentUserInterceptor")
        const request  = context.switchToHttp().getRequest();
        const {userId} = request.session || {};
        if(userId){
            const user = await this.usersService.findOne(userId);
            request.currentUser = user;
        }
        return handle.handle();
    }

}
