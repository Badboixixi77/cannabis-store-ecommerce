# Database Setup Instructions

## Prerequisites
- PostgreSQL installed on your system
- Database user with creation privileges

## Setup Steps

### 1. Install PostgreSQL (if not already installed)

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from https://www.postgresql.org/download/windows/

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
psql postgres

# Create database
CREATE DATABASE cannabis_store;

# Create user (optional - you can use existing user)
CREATE USER cannabis_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cannabis_store TO cannabis_user;

# Exit psql
\q
```

### 3. Run Schema

```bash
# Navigate to project directory
cd /path/to/your/project

# Run the schema file
psql cannabis_store < database/schema.sql

# Or if using custom user:
psql -U cannabis_user -d cannabis_store < database/schema.sql
```

### 4. Update Environment Variables

Edit `backend/.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cannabis_store
DB_USER=your_username
DB_PASSWORD=your_password
```

### 5. Test Connection

You can test the database connection by starting the backend server:

```bash
cd backend
npm run dev
```

If successful, you should see "Connected to PostgreSQL database" in the console.

## Troubleshooting

### Common Issues:

1. **Connection refused**: Make sure PostgreSQL is running
2. **Authentication failed**: Check username/password in .env file
3. **Database does not exist**: Make sure you created the database
4. **Permission denied**: Ensure user has proper privileges

### Quick Test:
```bash
# Test if you can connect to the database
psql -U your_username -d cannabis_store -c "SELECT COUNT(*) FROM users;"
```

This should return `0` if the schema was loaded correctly.