import { Response } from 'express'; 
import { AuthRequest } from '../middleware/auth.middleware';
import { updateUser } from '../models/user.model';
import { updateProfile, updateUserInterests, getProfileDetails } from '../models/profile.model';

export const updateProfileDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const {
            first_name,
            last_name,
            email,
            gender,
            sexual_preference,
            biography,
            date_of_birth,
            latitude,
            longitude,
            location_city,
            interests
        } = req.body

        await updateUser(userId, { first_name, last_name, email });

        await updateProfile(userId, { 
            gender, 
            sexual_preference, 
            biography, 
            date_of_birth,
            latitude,
            longitude,
            location_city
        });

        if (interests && Array.isArray(interests)){
            await updateUserInterests(userId, interests);
        }
        
        const profile = await getProfileDetails(userId);

        res.status(200).json({
            message: 'Profile updated successfully',
            profile
        });

    } catch (error) {
        console.error('update profile details error: ', error);
        res.status(500).json({  error: 'Internal server error' });
    }
}