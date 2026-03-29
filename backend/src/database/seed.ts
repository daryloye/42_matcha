import bcrypt from "bcrypt";
import { query } from "../config/database";
import * as seedData from '../../profiles.json';

type SeedProfileType = {
  index: number,
  id?: string,
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  profile_pic: string,
  gender: string,
  sexual_preference: string,
  date_of_birth: string,
  biography: string,
  interests: string[],
  location_city: string,
}

export async function seedProfiles() {
  console.log('Starting profiles seed...');

  try {
    for (const p of seedData.profiles as SeedProfileType[]) {
      const id = await insertIntoUsersTable(p);
      await insertIntoProfilesTable(p, id);
      await insertIntoProfilePicturesTable(p, id);
      await insertIntoInterestTables(p, id);
    }
  }
  catch (error) {
    console.error("❌ seeding error: ", error);
  }

  console.log(`${seedData.profiles.length} profiles seeded`);
}

async function insertIntoUsersTable(profile: SeedProfileType) {
  let userResult: any;
  const hashedPassword = await bcrypt.hash(profile.password, 10);

  if (profile.id) {
    userResult = await query (
      ` INSERT INTO users (id, email, username, first_name, last_name, password_hash, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING
        RETURNING id `,
      [profile.id, profile.email, profile.username, profile.firstname, profile.lastname, hashedPassword, true],
    )
  } 
  else {
    userResult = await query (
      ` INSERT INTO users (email, username, first_name, last_name, password_hash, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
        RETURNING id  `,
      [profile.email, profile.username, profile.firstname, profile.lastname, hashedPassword, true],
    )
  }

  return userResult.rows[0].id;
}

async function insertIntoProfilesTable(profile: SeedProfileType, id: string) {
  await query(
    ` INSERT INTO profiles (user_id, gender, sexual_preference, biography, date_of_birth, location_city) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (user_id) DO NOTHING  `,
    [id, profile.gender, profile.sexual_preference, profile.biography, profile.date_of_birth, profile.location_city],
  );
}

async function insertIntoProfilePicturesTable(profile: SeedProfileType, id: string) {
  await query(
    ` INSERT INTO profile_pictures (user_id, is_profile_picture, image_url)
      VALUES ($1, $2, $3) `,
    [id, true, profile.profile_pic],
  );
}

async function insertIntoInterestTables(profile: SeedProfileType, id: string) {
  for (const name of profile.interests) {
    const interestResult = await query(
        `INSERT INTO interests (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
        [name]
    );
    
    const interestId = interestResult.rows[0].id;
    await query(
        `INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [id, interestId]
    );
  }
}
