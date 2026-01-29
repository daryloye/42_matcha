# backend manual
# 29 Jan 2026 12:31pm
to run back end and check if server is running:

Step 1: cd to backend director
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