
import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

//Khong lay dc process.env thi dung cach nay
export  const getDbOptions = (configService: ConfigService): DataSourceOptions => {
  const environment = configService.get<string>('NODE_ENV');


  var dbOptions: DataSourceOptions = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['dist/**/*.entity.js'],
      migrations:['dist/db/migrations/*.js'],
      migrationsTableName: 'migration_log',
      synchronize: false,
    };
    console.log('ENV hiện tại: => ',environment)
    switch (environment) {
      case 'development':
        break;
      case 'test':
        Object.assign(dbOptions, {
          database: 'test.sqlite',
          entities: ['src/**/*.entity.ts'],
          migrations: ['db/migrations/*.ts'],
          migrationsRun: true,
        });
        break;
      case 'production':
        Object.assign(dbOptions, {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT'), 10),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: true,
          ssl: {
            rejectUnauthorized: false, // Tắt xác thực chứng chỉ SSL (không khuyến khích cho môi trường sản xuất)
          },
          synchronize: true,
          logging: true, // Ghi log hoạt động
 
        });
      console.log('ENV hiện tại: => ',dbOptions)
        break;
      default:
        throw new Error('unknown environment');
    }
  return dbOptions
  };
