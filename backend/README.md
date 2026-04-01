# API Documentation

## Base URL

```
http://localhost:3000
```

---

## Authentication

Beberapa endpoint membutuhkan authentication menggunakan JWT token.

**Header**

```
Authorization: Bearer <access_token>
```

---

## Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Request successful",
  "data": {}
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message",
  "errors": {}
}
```

---

## Endpoints

### Auth

#### Login

```
POST /auth/login
```

Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "access_token": "your_jwt_token"
  }
}
```

---

#### Register

```
POST /auth/register
```

Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "status": "success",
  "message": "User created",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

#### Get All Users

```
GET /auth/users
```

Response

```json
{
  "status": "success",
  "message": "List users",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

---

## Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

## Notes

* Gunakan DTO untuk validasi request
* Gunakan authentication guard untuk endpoint yang membutuhkan proteksi
* Semua response sebaiknya konsisten menggunakan format yang sama
* Pisahkan module berdasarkan domain (auth, user, dll)
