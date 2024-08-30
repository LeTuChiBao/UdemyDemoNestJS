import { DataSource } from 'typeorm';
import dbOptions from './db-option'; 
// import { config } from 'dotenv';

// config();
const dataSource = new DataSource(dbOptions);
export default dataSource;
