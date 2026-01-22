import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER, 
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

export const query = async(text: string, params?: any[]) => {
    try {
        const result = await pool.query(text, params);
        return result; 
    } catch (error) {
        console.log('Database query error:',  error);
        throw error;
    }
};

//test connection 
export const testConnection = async() => {
    try {
        const result = await pool.query('SELECT NOW()')
        console.log('✅ Database connected successfully');
        console.log('📅 Database time:', result.rows[0].now);
        return true;
    } catch(error) {
        console.log('❌ Database connection failed:', error);
        return false;
    }
};

export default pool;

//mkdir -p src/database/migrations


