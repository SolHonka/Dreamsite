# Dreamsite Setup & api

**Node.js + Express** application.

## Usage

1. Clone/download code
2. Install & start MySQL/MariaDB server
3. Run the contents of "sqlbase.sql" to create the database
4. Edit the "db.js" file to match your usage
5. Run the "server.js" file

## Resources and endpoints

### `/auth/register` 

```http
#register user
POST http://127.0.0.1:3000/auth/register
content-type: application/json
{
  "username": "user",
  "password": "secret"
}
```

### `/auth/login` 

Example queries:

```http
# Login
POST http://127.0.0.1:3000/auth/login
content-type: application/json
{
  "username": "user",
  "password": "secret"
}
```

### `/dreams/create`

Example queries:

```http
# Create a dream for a logged in user
POST http://127.0.0.1:3000/dreams/create
Authorization: Bearer <token>

content-type: application/json
{
  "dream_text": "I dreamt of sheep",
  "dream_date": date
}
```

### `/dreams/get`

Example queries:

```http
# Get all dreams a logged in user
GET http://127.0.0.1:3000/dreams/get
Authorization: Bearer <token>
```

### `/dreams/delete`

Example queries:

```http
# Delete logged dream of a logged in user by dream id
POST http://127.0.0.1:3000/dreams/delete
content-type: application/json
body: {"dreamId": id}
```
