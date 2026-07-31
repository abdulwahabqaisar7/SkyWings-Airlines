# SkyWings Airlines - Flight Booking System

A complete flight booking system built with Node.js, Express, MySQL, and vanilla JavaScript. This application provides a full-featured airline booking platform with user authentication, flight search, booking management, check-in, and admin dashboard.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
  - ⚠️ **Note:** This project uses standalone MySQL Server (not XAMPP MySQL)
  - Ensure MySQL Server is running as a Windows service

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Create a `.env` file in the root directory (copy from `.env.example` if available)
   - Add your MySQL Server credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_root_password
   DB_NAME=skywings_airlines
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=skywings-secret-key-change-in-production
   ```
   - ⚠️ **Important:** Replace `your_mysql_root_password` with your actual MySQL root password
   - If you don't have a password set, leave `DB_PASSWORD=` empty
   
3. **Test MySQL Connection**
   ```bash
   node scripts/test_mysql_connection.js
   ```
   This will verify your MySQL connection settings before proceeding.

3. **Setup Database**
   ```bash
   mysql -u root -p < sql/schema.sql
   ```

4. **Initialize Passwords**
   ```bash
   node scripts/initialize_database.js
   ```

5. **Insert Sample Data (Optional but Recommended)**
   ```bash
   node scripts/insert_comprehensive_data.js
   ```
   This will create:
   - 100+ user accounts
   - 150+ bookings distributed across users
   - 400+ passengers
   - All with realistic data

6. **Start Server**
   ```bash
   npm start
   ```

7. **Access Application**
   - Open browser: `http://localhost:3000`

## 🔐 Default Login Credentials

After running `scripts/initialize_database.js` and `scripts/insert_comprehensive_data.js`, use these credentials:

### Admin Account
- **Email:** `admin@skywings.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard, manage flights, users, bookings, aircraft, reports

### Sample User Accounts

**Original Test User:**
- **Email:** `user@skywings.com`
- **Password:** `user123`

**Additional Test Users (100 users created):**
- **Email Pattern:** `user1@skywings.com` through `user100@skywings.com`
- **Password Pattern:** `user1123` through `user100123`
- Example: `user1@skywings.com` / `user1123`, `user2@skywings.com` / `user2123`, etc.

**Sample User Accounts (First 10):**
1. **John Smith** - `user1@skywings.com` / `user1123`
2. **Jane Johnson** - `user2@skywings.com` / `user2123`
3. **Michael Williams** - `user3@skywings.com` / `user3123`
4. **Sarah Brown** - `user4@skywings.com` / `user4123`
5. **David Jones** - `user5@skywings.com` / `user5123`
6. **Emily Garcia** - `user6@skywings.com` / `user6123`
7. **James Miller** - `user7@skywings.com` / `user7123`
8. **Emma Davis** - `user8@skywings.com` / `user8123`
9. **Robert Rodriguez** - `user9@skywings.com` / `user9123`
10. **Olivia Martinez** - `user10@skywings.com` / `user10123`

> **Note:** Full list of all 100 user credentials is saved in `USER_CREDENTIALS.txt` file after running the data insertion script.

## 📋 Features

### User Features
- ✅ User registration and login
- ✅ Flight search with filters (from, to, date, class)
- ✅ Flight booking with passenger details
- ✅ View and manage bookings
- ✅ Check-in functionality
- ✅ User profile management
- ✅ Booking cancellation

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Flight management (add, edit, delete flights)
- ✅ View all bookings
- ✅ User management
- ✅ System statistics and reports

## 🗂️ Project Structure

```
WEB/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                      # Environment variables
├── config/
│   └── database.js          # Database connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── flights.js           # Flight routes
│   ├── bookings.js          # Booking routes
│   ├── checkin.js           # Check-in routes
│   ├── users.js             # User routes
│   └── admin.js             # Admin routes
├── sql/
│   └── schema.sql           # Database schema
├── scripts/
│   ├── initialize_database.js      # Password initialization
│   ├── insert_comprehensive_data.js  # Insert 100+ users and bookings
│   └── add_more_flights.js        # Add flights to reach 100+
├── css/
│   └── style.css            # Styles
├── js/
│   └── main.js              # Frontend JavaScript
└── *.html                   # HTML pages
```

## 📊 Database Statistics

After running the setup scripts, your database will contain:
- **102+ Users** (1 admin + 1 original user + 100 new users)
- **100+ Flights** (spread across different routes and dates)
- **200+ Bookings** (distributed across all users with various statuses)
- **400+ Passengers** (linked to bookings)
- **4 Aircraft** (can be expanded via admin panel)

**To populate database with sample data:**
```bash
# After initial setup, run:
node scripts/insert_comprehensive_data.js
node scripts/add_more_flights.js
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/check` - Check authentication
- `POST /api/auth/logout` - Logout

### Flights
- `GET /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details
- `GET /api/flights/status/:flightNumber` - Get flight status

### Bookings
- `POST /api/bookings/create` - Create booking (requires auth)
- `GET /api/bookings/list` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)
- `POST /api/bookings/:id/cancel` - Cancel booking (requires auth)

### Check-in
- `POST /api/checkin/search` - Search booking for check-in
- `POST /api/checkin/confirm` - Confirm check-in

### User Profile
- `GET /api/users/profile` - Get profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)
- `PUT /api/users/password` - Change password (requires auth)

### Admin (Admin only)
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/flights` - Get all flights
- `POST /api/admin/flights` - Create flight
- `PUT /api/admin/flights/:id` - Update flight
- `DELETE /api/admin/flights/:id` - Delete flight
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/users` - Get all users

## 🗄️ Database

### Sample Data Included
- **8 Airports:** NYC, LAX, CHI, MIA, LON, PAR, TOK, DXB
- **4 Aircraft:** Boeing 737-800, 777-300ER, Airbus A320, A350
- **8 Sample Flights** with future dates
- **Seats** for all aircraft
- **2 Default Users** (admin and regular user)

### Database Schema
The database includes tables for:
- Users (customers and admins)
- Aircraft
- Airports
- Flights
- Bookings
- Passengers
- Seats
- Check-ins
- User Preferences

## 🚨 Troubleshooting

### "Cannot connect to database"
- Ensure **MySQL Server** is running (not XAMPP MySQL)
  - Check Windows Services: `services.msc` → Look for "MySQL80" or "MySQL"
  - Or run: `Get-Service -Name "*mysql*"` in PowerShell
- Check `.env` file has correct password (or leave empty if no password)
- Verify database `skywings_airlines` exists
- Test connection: `node scripts/test_mysql_connection.js`

### "Login not working"
- Make sure you ran `node scripts/initialize_database.js`
- Check that users exist in database

### "Port 3000 already in use"
- Change PORT in `.env` file to another number (e.g., 3001)
- Restart the server

### "Flights not showing"
- Verify flights were inserted (check `flights` table)
- Check flight dates are in the future
- Ensure flights have status 'scheduled' or 'boarding'

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## 📝 Development Commands

```bash
# Start server (production)
npm start

# Start server with auto-reload (requires nodemon)
npm run dev

# Install dependencies
npm install
```

## 🔒 Security Notes

⚠️ **Important for Production:**

1. **Change Default Passwords:**
   - Change MySQL root password
   - Change default user passwords in database
   - Change JWT_SECRET in `.env` to a strong random string

2. **Environment Variables:**
   - Never commit `.env` file to version control
   - Use strong passwords
   - Don't share your `.env` file

3. **Database:**
   - Create a dedicated MySQL user (not root) for the application
   - Grant only necessary permissions

## 📞 Support

If you encounter issues:
1. Check error messages in terminal
2. Verify MySQL is running
3. Check `.env` configuration
4. Review database connection settings

## 📄 License

This project is open source and available for educational purposes.

---

**Made with ❤️ for SkyWings Airlines**

**Last Updated:** 2025
