# SkyWings Airlines — Database

Self-contained database setup for the SkyWings Airlines application.

## Prerequisites

- **Node.js** (v16+)
- **MySQL Server** (v8.0+ recommended)

## Quick Start

### 1. Install dependencies

```bash
cd database
npm install
```

### 2. Configure connection

Copy and edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=skywings_airlines
```

### 3. Test connection

```bash
npm run test-connection
```

### 4. Create the database & import schema

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS skywings_airlines;"
mysql -u root -p skywings_airlines < schema/schema.sql
```

### 5. Initialize default users

```bash
npm run init
```

This sets up password hashes for the default users:
- **Admin:** admin@skywings.com / admin123
- **User:** user@skywings.com / user123

### 6. Seed sample data

```bash
npm run seed                # Basic sample data
npm run seed:comprehensive  # Comprehensive data set
npm run seed:seats          # Seat assignments
npm run seed:flights        # Additional flights
npm run seed:additional     # Extra data
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run test-connection` | Verify MySQL connection |
| `npm run init` | Initialize default user passwords |
| `npm run seed` | Insert basic sample data |
| `npm run seed:comprehensive` | Insert comprehensive data set |
| `npm run seed:seats` | Insert seat assignments |
| `npm run seed:flights` | Add more flights |
| `npm run seed:additional` | Populate additional data |

## Directory Structure

```
database/
├── schema/
│   └── schema.sql           # Full DDL (tables, indexes, constraints)
├── seeds/
│   ├── test_mysql_connection.js
│   ├── initialize_database.js
│   ├── insert_sample_data.js
│   ├── insert_comprehensive_data.js
│   ├── insert_seats.js
│   ├── add_more_flights.js
│   ├── populate_additional_data.js
│   └── populate_seats_preferences_checkins.js
├── package.json
├── .env
└── README.md
```
