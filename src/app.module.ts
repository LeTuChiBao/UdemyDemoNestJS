
import { MiddlewareConsumer, Module , ValidationPipe} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import {getDbOptions} from '../db/db-option';
const cookieSession = require('cookie-session')
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    // TypeOrmModule.forRoot(dbOptions),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => getDbOptions(configService),
      inject: [ConfigService],
    }),
  UsersModule, 
  ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
  {
    provide: APP_PIPE,
    useValue:  new ValidationPipe({
      whitelist: true, //loại bỏ các trường không có trong dto
      forbidNonWhitelisted: true //Phần này để thông báo lỗi khi trường ko có trong dto
    })
  }],
})
export class AppModule {
  constructor(private configService: ConfigService){}
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        name: 'session',
        keys: [this.configService.get<string>('COOKIE_KEY')],
        maxAge: 24 * 60 * 60 * 1000
      })
    )
    .forRoutes('*');
  }
}
