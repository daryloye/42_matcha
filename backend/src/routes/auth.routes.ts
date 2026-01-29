import { Router } from 'express'; 
import { register } from '../controllers/auth.controller'


const router = Router();

router.post('/register', register);

export default router;

/*
1. Import Router from Express
2. Import controller functions (register, and later: login, verify)
3. Create a router instance
4. Define routes - map URLs to controller functions
5. Export the router 
*/