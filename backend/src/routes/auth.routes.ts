import { Router } from 'express'; 
import { register, verify, login } from '../controllers/auth.controller'
// import { verify } from 'node:crypto';


const router = Router();

router.post('/register', register);
router.get('/verify', verify);
router.post('/login', login);

export default router;

/*
1. Import Router from Express
2. Import controller functions (register, and later: login, verify)
3. Create a router instance
4. Define routes - map URLs to controller functions
5. Export the router 
*/