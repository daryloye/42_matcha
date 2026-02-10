import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    createBlankProfile,
    getProfileByUserId,
    updateProfile,
    addProfilePicture,
    setProfilePicture,
    getProfilePictures,
    getPrimaryProfilePicture,
    deleteProfilePicture

} from '../models/profile.model'
        
// 1. Get userId from authenticated user
// 2. Get profile data from request body
// 3. Check if profile already exists
// 4. Create blank profile if doesn't exist

// 5. Update profile with provided data
// 6. Return updated profile

export const completeProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({ error: 'user not authenticated'});
            return;
        }
        const{ gender, sexual_preference, biography, latitude, longitude, location_city }  = req.body;
        let profile = await getProfileByUserId(userId);
        if(!profile){
            await createBlankProfile(userId);
        }
        profile = await updateProfile(userId, {gender, sexual_preference, biography, latitude, longitude, location_city});
        res.status(200).json({message: 'Profile completed successfully', profile});
    }catch(error){
        console.error('complete profile error: ', error)
        res.status(500).json({error: 'failed to complete profile'}); 
    }

};
