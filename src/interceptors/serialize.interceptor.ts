import { 
    UseInterceptors, 
    NestInterceptor, 
    ExecutionContext, 
    CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor{
    new (...args: any[]) : {}
}

export function Serialize(dto:ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto:any){}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //Run sopme thing before a request is handled
        //by the request handle
        console.log("Đã vào => SerializeInterceptor")

        console.log('Im running before the handle');

        return handler.handle().pipe(
            map((data:any) => {
                //Rung something before the response is sent out
                console.log('Img running before response is sent out', data);

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true // function này để chắc chắc class so sanh với class dto có các trường được lấy hoặc ko được lấy
                })
                
            })
        )
        
    }
}