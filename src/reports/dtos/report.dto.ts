import { Report } from './../report.entity';
import { User } from './../../users/user.entity';
import { Expose, Transform } from "class-transformer";

export class ReportDto {

    @Expose()
    id: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: number;

    @Expose()
    mileage: number;

    @Expose()
    long: number;

    @Expose()
    lat: number;

    @Expose()
    price: number;

    @Expose()
    approved: boolean
    
    @Transform(({obj})=> obj.user.id)
    @Expose()
    userId: number;

}