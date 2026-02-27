import bcrypt from "bcrypt";
import { query } from "../config/database";

export async function seedAdmin() {
  console.log("starting database seed...");
  try {
    const adminEmail = "admin@matcha.com";
    const hashedPassword = await bcrypt.hash("MatchaAdmin2026!", 10);

    const userResult = await query(
      `
                INSERT INTO users (email, username, first_name, last_name, password_hash, is_verified)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (email) DO NOTHING
                RETURNING id `,

      [adminEmail, "admin", "Admin", "Matcha", hashedPassword, true],
    );

    if (userResult.rows.length > 0) {
      const adminId = userResult.rows[0].id;
      await query(
        `INSERT INTO profiles (user_id, gender, sexual_preference, biography, date_of_birth, location_city) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 ON CONFLICT (user_id) DO NOTHING`,
        [
          adminId,
          "other",
          "both",
          "System Administrator account",
          "2025-08-09",
          "Singapore",
        ],
      );

      await query(
        `INSERT INTO profile_pictures (user_id, is_profile_picture, image_url)
              VALUES ($1, $2, $3)`,
        [adminId, true, 'https://via.placeholder.com/150'],
      );

      const interestNames = ['coffee', 'hiking', 'coding'];

      for (const name of interestNames) {
          const interestResult = await query(
              `INSERT INTO interests (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
              [name]
          );
          const interestId = interestResult.rows[0].id;
          await query(
              `INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [adminId, interestId]
          );
      }

      console.log("✅ Admin account and profile seeded!");

    } else {
      console.log("⚠️ Admin already exists. No changes made.");
    }
  } catch (error) {
    console.error("❌ seeding error: ", error);
  }

}
