import { DataSource } from 'typeorm';
import {getDbOptions} from './db-option'; 
import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';

// config();
const configService = new ConfigService();
const options = getDbOptions(configService);
const dataSource = new DataSource(options);
export default dataSource;
