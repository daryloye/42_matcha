# backend manual
# Password reset endpoint

# 5 Feb
Profile System ⭐

⏳ Profile completion (gender, bio, preferences, interests, location)
⏳ Photo upload (up to 5 images)
⏳ Profile editing (update any profile info)
⏳ View own profile
⏳ Fame rating calculation


# 4 Feb 2026 3:52pm

✅ Login endpoint
✅ Password reset endpoint
⏳ Profile system
⏳ Browsing/Matching
⏳ Chat (Socket.IO)
⏳ Notifications

Model functions (user.model.ts):

✅ setResetToken() - You already have this!
✅ findUserByResetToken() - Find user by reset token
✅ updatePassword() - Update user's password
✅ clearResetToken() - Clear token after password reset

Controller functions (auth.controller.ts):

✅ forgotPassword() - Generate token, send email
✅ resetPassword() - Verify token, update password

Routes (auth.routes.ts):

✅  POST /forgot-password
✅  POST /reset-password

# 2 Feb 2026 3:52pm

Continuation of (Backend):

🔐 Authentication Flow Testing
Follow these steps to test the Mandatory Part (IV.1) of the application using the terminal.

1. Register a New Account
This step creates a new user in the database with a hashed password and sends a verification email.

Bash
curl -i -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jack.sng@gmail.com",
    "username": "jacksng",
    "first_name": "Jack",
    "last_name": "Sng",
    "password": "MyP@ssw0rd123"
  }'
Note: Ensure your password meets the complexity requirements (no common English words).

2. Verify Email Address
Before logging in, the is_verified flag must be set to true. Find the verification_token in your database or your Mailgun email, then run:

Bash
curl -i -X GET "http://localhost:5001/api/auth/verify?token=YOUR_TOKEN_STRING"
3. Login to Receive JWT
Once verified, you can authenticate to receive your JSON Web Token (JWT). This token is required for all subsequent "protected" routes like profile updates.

Bash
curl -i -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jack.sng@gmail.com",
    "password": "MyP@ssw0rd123"
  }'

✅ Login endpoint
⏳ Password reset endpoint
⏳ Profile system
⏳ Browsing/Matching
⏳ Chat (Socket.IO)
⏳ Notifications

Understanding the Login Flow
here's what login needs to do:
1. Get email and password from request body
2. Validate input (not empty)
3. Find user by email in database
4. Check if user exists
5. Check if user is verified
6. Compare password with hashed password (bcrypt)
7. Generate JWT token
8. Return token + user info to frontend

User logs in
    ↓
Backend creates JWT with user's data
    ↓
Sends JWT back to frontend
    ↓
Frontend stores it
    ↓
Every future request, frontend sends JWT
    ↓
Backend verifies JWT signature using JWT_SECRET
    ↓
If valid → User is authenticated!

# 29 Jan 2026 12:31pm
to run back end and check if server is running:

Step 1: cd to backend directory
step 2: npm run dev on a termnial
step 3: open up new terminal and run curl http://localhost:5001/health

postgres database name and password: 
matcha_db
matcha_password_123

To view data base:
cd to backend
psql -U matcha_user -d matcha_db
\dt          # Lists all tables with metadata
\d users     # Shows the actual columns INSIDE the users table

##############################
Test with curl
STEP 1: 
npm run dev
```

You should see:
```
🚀 Server running on port 5001
📝 Environment: development
✅ Database connected successfully
📅 Database time: ...
✅ Tables initialized successfully

STEP 2:
Open a new terminal (keep the server running in the first one).
Here's the curl command structure:
Note: 
(i)we are using mailgun. Only authorized email will receive verification email for mailgun's free tier.
(ii) Replace your_email@example.com with your actual authorized email, then run the curl command.

curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_email@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "password": "Test@Password123"
  }'

STEP 3:
if successful:
{
  "message": "Registration successful! Please check your email to verify your account."
}
```

**And in your server logs:**
```
✅ User created with ID: 1
✅ Verification email sent to your_email@example.com
##############################

# 29 Jan 2026 12:31pm
✅ Database setup- Done!
✅ Email utility (Mailgun configured!)- Done!
✅ Validation utility- Done!
✅ User model- Done!
✅ Auth controller - DONE! 
✅ Auth routes - DONE!
✅ Connect routes to server -DONE! 🎉

# 28 Jan 2026
✅ Database setup- Done!
✅ Email utility (Mailgun configured!)- Done!
✅ Validation utility- Done!
✅ User model- Done!
✅ Auth controller - DONE! 🎉
⏳ Auth routes - Next!
⏳ Connect routes to server

# 27 Jan 2026
Backend:

✅ Database setup - Done!
✅ Email utility - Done!
✅ Validation utility - Done!
✅ User model - DONE! 
⏳ Auth controller - Next!
⏳ Auth routes - After controller
⏳ Connect routes to server - Final step

# 26 Jan 2026
1. ✅ Database setup - Done!
2. ✅ Email utility - Done!
3. ✅ Validation utility - Done!
4. ⏳ User model - Need to create (SQL queries for database)
5. ⏳ Auth controller - Need to create (registration logic)
6. ⏳ Auth routes - Need to create (map URLs to controllers)
7. ⏳ Connect routes to server - Wire everything together
Frontend:
1. ⏳ Registration form - HTML form to submit data
2. ⏳ API calls - Fetch requests to backend