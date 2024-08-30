
import { DataSourceOptions } from "typeorm";

var dbOptions: DataSourceOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['dist/**/*.entity.js'],
    migrations:['dist/db/migrations/*.js'],
    migrationsTableName: 'migration_log',
    synchronize: false,
  };
  console.log('ENV hiện tại: => ',process.env.NODE_ENV)
  switch (process.env.NODE_ENV) {
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
        url: process.env.DATABASE_URL,
        migrationsRun: true,
        ssl: {
          rejectUnauthorized: false,
        },
        
      });
      break;
    default:
      throw new Error('unknown environment');
  }

export default dbOptions ;
