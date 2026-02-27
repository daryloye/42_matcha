import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    createBlankProfile,
    getProfileByUserId,
    updateProfile,
    getProfileMe,
    getProfileDetails,
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

/*
1. Get userId from req.user (set by requireAuth middleware)
2. Check if userId exists
3. Get profile from database using getProfileByUserId(userId)
4. Check if profile exists
5. If no profile → return 404 error
6. If profile exists → return it
*/
export const getOwnerProfile = async (req: AuthRequest, res: Response): Promise <void> => {
    try{
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({error: 'user not authenticated'});
            return;
        }
        const userProfile = await getProfileByUserId(userId);
        if(!userProfile) {
            res.status(404).json({error: 'user profile does not exist'});
            return;
        }
        res.status(200).json({message: 'Owner\'s Profile returnted successfully', userProfile});
    }catch(error){
        console.error('error getting owner', error);
        res.status(500).json({error: 'Internal server error'});

    }
};

export const getOthersProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId){
            res.status(401).json({error: 'user not authenticated'});
            return;
        }
        const { id: targetId } = req.params as { id: string };        
        if(!targetId){
            res.status(400).json({error: 'invalid id numver'});
            return;
        }
        const targetProfile = await getProfileByUserId(targetId);
        if(!targetProfile){
            res.status(404).json({error: 'user not authenticated'});
            return;
        }
        // TODO: Track profile view (will implement in Step 22)
        // await trackProfileView(userId, targetId);
        res.status(200).json({profile: targetProfile});

    }catch(error){
        console.error('error getting other\'s profile', error);
        res.status(500).json({error: 'internal server error'});
    }
    
};

/*Get userId from req.user
Get update data from req.body
Call updateProfile(userId, data)
Return updated profile*/

export const updateOwnProfile = async(req: AuthRequest, res: Response): Promise<void> => {
    try { 
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({error: 'user not authenticated'});
            return;
        }

        const { gender, sexual_preference, biography, latitude, longitude, location_city } = req.body;
        const profile = await updateProfile(userId, {gender, sexual_preference, biography, latitude, longitude, location_city});
        
        if(!profile){
            res.status(404).json({error: 'Profile not found'});
            return;
        }
        res.status(200).json({message: 'Profile updated successfully', profile});
    } catch (error) {
        console.error('error getting owner', error);
        res.status(500).json({error: 'internal server error'})
    }
};

/*Get userId from req.user
Check it exists
Call the model function
Handle null case
Return result

{
  firstname,
  lastname,
  username,
  picture,
  isProfileCompleted
}

*/

export const getMe = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({error: 'user not authenticated'});
            return;
        }
        const meProfile = await getProfileMe(userId);

        if(!meProfile){
            res.status(404).json({error: 'user profile does not exist'});
            return;
        }
        res.status(200).json({message: 'Owner\'s Profile returnted successfully', meProfile});
    }catch(error){
        console.error('error getting owner', error);
        res.status(500).json({error: 'Internal server error'});

    }

    /*
        as requested:

        what gets returned:
        {
            firstname,
            lastname,
            username,
            picture,
            isProfileCompleted
        }
    */

}

export const getFullProfileDetails = async(req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({error: 'user not authenticated'});
            return;
        }

        const fullProfileDetails = await getProfileDetails(userId);

        if(!fullProfileDetails){
            res.status(404).json({error: 'user profile does not exist'});
            return;
        }
        res.status(200).json({ message: 'Profile returned successfully', fullProfileDetails});

    } catch (error) {
        console.error('error getting owner', error);
        res.status(500).json({error: 'Internal server error'});
    }
    /*as requested

    what gets returned:

        {
                firstname: "firstname"
                lastname: "lastname"
                email: "user@email.com"
                date_of_birth: "01/01/2000"
                gender: "male"
                preference: "female"
                fame: 10
                biography: "this is my biography"
                interest:
                  - "one"
                  - "two"
                  - "three"
                  - "four"
                  - "five"
                pictures:
                  - "http://localhost:5001/image/profile.jpg"
                  - "http://localhost:5001/image/one.jpg"
                  - "http://localhost:5001/image/two.jpg"
                  - "http://localhost:5001/image/three.jpg"
                  - "http://localhost:5001/image/four.jpg"
                location:
                  latitude: 123
                  longitude: 456
        }*/
}