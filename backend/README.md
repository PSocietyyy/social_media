# API Documentation

## Base URL

```
http://localhost:3001
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

## Auth

### Register

```
POST /auth/register
```

Request Body

```json
{
  "name": "John Doe",
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

Response `201`

```json
{
  "status": "success",
  "message": "User created",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "john",
    "email": "john@example.com",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Login

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

Response `200`

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci..."
  }
}
```

> `access_token` berlaku selama **15 menit**.  
> `refresh_token` berlaku selama **7 hari** dan disimpan di database.

---

### Refresh Token

```
POST /auth/refresh
```

Gunakan endpoint ini untuk mendapatkan `access_token` baru tanpa login ulang.

Request Body

```json
{
  "refresh_token": "eyJhbGci..."
}
```

Response `200`

```json
{
  "status": "success",
  "message": "Token refreshed",
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci..."
  }
}
```

> **Rotasi aktif** — setiap kali refresh, token lama dihapus dari DB dan token baru digenerate.  
> Selalu simpan `refresh_token` terbaru dari response ini.

Error Response

```json
{
  "status": "error",
  "message": "Refresh token tidak valid"
}
```

```json
{
  "status": "error",
  "message": "Refresh token sudah expired"
}
```

---

### Logout

```
POST /auth/logout
```

Headers

```
Authorization: Bearer <access_token>
```

Request Body

```json
{
  "refresh_token": "eyJhbGci..."
}
```

Response `200`

```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

> `refresh_token` dihapus dari database.  
> `access_token` akan expired sendiri setelah 15 menit.

---

### Get All Users (Admin Only)

```
GET /auth/users
```

Headers

```
Authorization: Bearer <access_token>
```

Response `200`

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

## Users

### Get All Users

```
GET /users
```

Headers

```
Authorization: Bearer <access_token>
```

Response `200`

```json
{
  "status": "success",
  "message": "List users",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "john",
      "email": "john@example.com",
      "bio": null,
      "avatar": null,
      "role": "USER"
    }
  ]
}
```

---

### Get Current User

```
GET /users/me
```

Headers

```
Authorization: Bearer <access_token>
```

Response `200`

```json
{
  "status": "success",
  "message": "Current user profile",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "john",
    "email": "john@example.com",
    "bio": null,
    "avatar": null,
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Update Current User

```
PATCH /users/me
```

Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body

```json
{
  "name": "Updated Name",
  "bio": "New bio",
  "avatar": "https://example.com/avatar.png",
  "password": "newpassword123"
}
```

Response `200`

```json
{
  "status": "success",
  "message": "User updated",
  "data": {
    "id": 1,
    "name": "Updated Name",
    "username": "john",
    "email": "john@example.com",
    "bio": "New bio",
    "avatar": "https://example.com/avatar.png",
    "role": "USER"
  }
}
```

---

### Delete Current User

```
DELETE /users/me
```

Headers

```
Authorization: Bearer <access_token>
```

Response `200`

```json
{
  "status": "success",
  "message": "User deleted"
}
```

---

### Update User by ID (Admin / Owner)

```
PATCH /users/:id
```

Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body

```json
{
  "name": "Updated Name",
  "bio": "Updated bio"
}
```

Rules

- User hanya bisa update dirinya sendiri
- Admin bisa update semua user

Response `200`

```json
{
  "status": "success",
  "message": "User updated",
  "data": {
    "id": 1,
    "name": "Updated Name",
    "username": "john",
    "email": "john@example.com",
    "bio": "Updated bio",
    "avatar": null,
    "role": "USER"
  }
}
```

---

### Delete User by ID (Admin / Owner)

```
DELETE /users/:id
```

Headers

```
Authorization: Bearer <access_token>
```

Rules

- User hanya bisa delete dirinya sendiri
- Admin bisa delete semua user

Response `200`

```json
{
  "status": "success",
  "message": "User deleted"
}
```

---

## Token Flow

```
POST /auth/login
→ { access_token (15m), refresh_token (7d) }

POST /auth/refresh   { refresh_token }
→ { access_token baru, refresh_token baru }  ← rotasi!

POST /auth/logout    Bearer + { refresh_token }
→ refresh_token dihapus dari DB
  access_token mati sendiri setelah 15m
```

---

# Post

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

- Gunakan DTO untuk validasi request
- Gunakan authentication guard untuk endpoint yang membutuhkan proteksi
- Semua response konsisten
- User tidak bisa mengubah `role` dan `isVerified`
- Password otomatis di-hash oleh server
- Gunakan `/users/me` untuk kebutuhan frontend
- Pisahkan module berdasarkan domain (auth, users, dll)
- Selalu perbarui `refresh_token` setiap kali hit `/auth/refresh` karena rotasi aktif