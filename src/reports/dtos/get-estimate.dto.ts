import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    //Công dụng của transform là chuyển dữ liệu từ http request trước khi nó vào validate
    @Transform(({value})=> parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @Transform(({value})=> parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @Transform(({value})=> parseInt(value))
    @IsLongitude()
    long: number;

    @Transform(({value})=> parseInt(value))
    @IsLatitude()
    lat: number;
 
}