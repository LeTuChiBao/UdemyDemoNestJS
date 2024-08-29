import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        console.log('=> Đã vào AdminGuard')
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser){
            return false;
        }
        console.log(request.currentUser);
        return request.currentUser.admin;

    }
}