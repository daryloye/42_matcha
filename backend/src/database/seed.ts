import bcrypt from 'bcrypt';
import { query } from '../config/database';

async function seedAdmin(){
    console.log('starting database seed...');
    try {
        const adminEmail = 'admin@matcha.com';
        const hashedPassword = await bcrypt.hash('MatchaAdmin2026', 10);


        const userResult = await query(
            `
                INSERT INTO users (email, username, first_name, last_name, password_hash, is_verified)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (email) DO NOTHING
                RETURNING id `,
                
                [adminEmail, 'admin', 'Admin', 'Matcha', hashedPassword, true]  
        );

        if (userResult.rows.length > 0){
            const adminId = userResult.rows[0].id;
            await query(
                `INSERT INTO profiles (user_id, gender, sexual_preference, biography, location_city) 
                 VALUES ($1, $2, $3, $4, $5) 
                 ON CONFLICT (user_id) DO NOTHING`,
                [adminId, 'other', 'both', 'System Administrator account.', 'Singapore']
            );
            console.log('✅ Admin account and profile seeded!');
        } else {
            console.log('⚠️ Admin already exists. No changes made.');
        }

    }catch (error){
        console.error('❌ seeding error: ', error);
    }finally{
        process.exit();
    }
}

seedAdmin();