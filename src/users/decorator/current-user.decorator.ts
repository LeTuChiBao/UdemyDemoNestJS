import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common'

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext)=> {
        console.log('Đã vào Current User Decorator')
        const request = context.switchToHttp().getRequest();
        console.log(request.currentUser);
        return request.currentUser;
    }
)