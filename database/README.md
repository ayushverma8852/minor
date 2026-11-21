# MySQL Database Setup Guide: `interviewprep_ai`

This directory provides the schema definitions and instructions to initialize the MySQL database for the **InterviewPrep AI** application.

---

## 1. Prerequisites
- **MySQL Server 8.0+** installed and running on `localhost:3306` (or Docker).
- Default user or dedicated user with `CREATE`, `ALTER`, `SELECT`, `INSERT`, `UPDATE`, `DELETE` privileges.

---

## 2. Quick Setup via MySQL CLI

Open your terminal or PowerShell and log into MySQL:

```bash
mysql -u root -p
```

Create the database and grant privileges:

```sql
CREATE DATABASE IF NOT EXISTS interviewprep_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'interview_user'@'localhost' IDENTIFIED BY 'InterviewPass123!';
GRANT ALL PRIVILEGES ON interviewprep_ai.* TO 'interview_user'@'localhost';
FLUSH PRIVILEGES;
```

Run the schema script:

```bash
mysql -u interview_user -p interviewprep_ai < database/schema.sql
```

---

## 3. Quick Setup via Docker

If you prefer running MySQL in a Docker container:

```bash
docker run --name interviewprep-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=interviewprep_ai \
  -e MYSQL_USER=interview_user \
  -e MYSQL_PASSWORD=InterviewPass123! \
  -p 3306:3306 \
  -d mysql:8.0
```

---

## 4. Automatic Migrations with Flyway

When running the Spring Boot backend (`backend/`), **Flyway** will automatically run migration scripts located at:
`backend/src/main/resources/db/migration/V1__initial_schema.sql`

You do not need to run manual schema migrations once the Spring Boot application is started against an empty `interviewprep_ai` database.

---

## 5. Demo Credentials Seeded

- **Email**: `demo@interviewprep.ai`
- **Username**: `demouser`
- **Password**: `DemoPass123!`
