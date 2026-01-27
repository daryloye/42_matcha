# backend manual

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


# 28 Jan 2026
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