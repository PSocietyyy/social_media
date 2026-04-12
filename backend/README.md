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

## Posts

### Create Post

```
POST /posts
```

Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body

```json
{
  "content": "Hello world!",
  "media": [
    {
      "url": "https://example.com/image.jpg",
      "type": "IMAGE"
    }
  ],
  "hashtags": ["nestjs", "typescript"]
}
```

> `content` dan `media` bersifat opsional, tapi **minimal salah satu harus diisi**.  
> `type` pada media hanya menerima nilai `IMAGE` atau `VIDEO`.  
> `hashtags` akan disimpan dalam lowercase secara otomatis.

Response `201`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Hello world!",
    "authorId": 3,
    "author": {
      "id": 3,
      "name": "John Doe",
      "username": "john",
      "avatar": null
    },
    "media": [
      {
        "id": 1,
        "url": "https://example.com/image.jpg",
        "type": "IMAGE",
        "postId": 1,
        "createdAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "hashtags": [
      {
        "id": 1,
        "postId": 1,
        "hashtagId": 1,
        "hashtag": {
          "id": 1,
          "name": "nestjs",
          "createdAt": "2026-01-01T00:00:00.000Z"
        }
      }
    ],
    "_count": {
      "likes": 0,
      "comments": 0
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Error Response — konten kosong

```json
{
  "message": "Post must have content or media"
}
```

---

### Get All Posts

```
GET /posts
```

Headers

```
Authorization: Bearer <access_token>
```

Query Parameters

| Parameter | Type    | Default | Description             |
| --------- | ------- | ------- | ----------------------- |
| `page`    | integer | `1`     | Halaman yang diambil    |
| `limit`   | integer | `10`    | Jumlah post per halaman |

Contoh Request

```
GET /posts?page=1&limit=5
```

Response `200`

```json
{
  "message": "Success",
  "data": [
    {
      "id": 2,
      "content": "Post terbaru",
      "authorId": 3,
      "author": {
        "id": 3,
        "name": "John Doe",
        "username": "john",
        "avatar": null
      },
      "media": [],
      "hashtags": [],
      "_count": {
        "likes": 5,
        "comments": 2
      },
      "createdAt": "2026-01-02T00:00:00.000Z",
      "updatedAt": "2026-01-02T00:00:00.000Z"
    }
  ]
}
```

> ⚠️ **Bug**: Data `meta` pagination (`total`, `page`, `limit`, `totalPages`) **tidak muncul** di response karena interceptor hanya mengambil field `data` dari return service. Untuk fix, perlu penyesuaian di `PostService.findAll()`.  
> Post diurutkan dari yang **terbaru** (`createdAt DESC`).

---

### Get Post by ID

```
GET /posts/:id
```

Headers

```
Authorization: Bearer <access_token>
```

Response `200`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Hello world!",
    "authorId": 3,
    "author": {
      "id": 3,
      "name": "John Doe",
      "username": "john",
      "avatar": null
    },
    "media": [
      {
        "id": 1,
        "url": "https://example.com/image.jpg",
        "type": "IMAGE",
        "postId": 1,
        "createdAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "hashtags": [
      {
        "id": 1,
        "postId": 1,
        "hashtagId": 1,
        "hashtag": {
          "id": 1,
          "name": "nestjs",
          "createdAt": "2026-01-01T00:00:00.000Z"
        }
      }
    ],
    "comments": [
      {
        "id": 5,
        "content": "Keren banget!",
        "authorId": 2,
        "postId": 1,
        "author": {
          "id": 2,
          "name": "Jane Doe",
          "username": "jane",
          "avatar": null
        },
        "createdAt": "2026-01-01T01:00:00.000Z",
        "updatedAt": "2026-01-01T01:00:00.000Z"
      }
    ],
    "_count": {
      "likes": 5,
      "comments": 1
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

> Detail post menyertakan **10 komentar terbaru** (`createdAt DESC`).

Error Response

```json
{
  "message": "Post #1 not found"
}
```

---

### Update Post

```
PATCH /posts/:id
```

Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body

```json
{
  "content": "Updated content",
  "media": [
    {
      "url": "https://example.com/new-image.jpg",
      "type": "IMAGE"
    }
  ],
  "hashtags": ["updated", "post"]
}
```

> Semua field bersifat **opsional** — hanya kirim field yang ingin diubah.  
> Jika `media` dikirim, **semua media lama akan diganti** dengan yang baru.  
> Jika `hashtags` dikirim, **semua hashtag lama akan diganti** dengan yang baru.  
> Hanya **pemilik post** yang bisa melakukan update.

Response `200`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Updated content",
    "authorId": 3,
    "author": {
      "id": 3,
      "name": "John Doe",
      "username": "john",
      "avatar": null
    },
    "media": [
      {
        "id": 2,
        "url": "https://example.com/new-image.jpg",
        "type": "IMAGE",
        "postId": 1,
        "createdAt": "2026-01-01T02:00:00.000Z"
      }
    ],
    "hashtags": [
      {
        "id": 2,
        "postId": 1,
        "hashtagId": 2,
        "hashtag": {
          "id": 2,
          "name": "updated",
          "createdAt": "2026-01-01T00:00:00.000Z"
        }
      }
    ],
    "_count": {
      "likes": 5,
      "comments": 1
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T02:00:00.000Z"
  }
}
```

Error Response — bukan pemilik

```json
{
  "message": "You can only update your own post"
}
```

Error Response — tidak ditemukan

```json
{
  "message": "Post #1 not found"
}
```

---

### Delete Post

```
DELETE /posts/:id
```

Headers

```
Authorization: Bearer <access_token>
```

> Hanya **pemilik post** yang bisa menghapus.  
> Menghapus post akan otomatis menghapus `media`, `comments`, `likes`, dan relasi `hashtags` (cascade).

Response `200`

```json
{
  "message": "Post #1 deleted successfully",
  "data": {
    "message": "Post #1 deleted successfully"
  }
}
```

> **Bug**: Field `data` berisi duplikat message karena interceptor mem-fallback ke seluruh object return service. Untuk fix, ubah return `remove()` di service menjadi `{ message: "...", data: null }`.

Error Response — bukan pemilik

```json
{
  "message": "You can only delete your own post"
}
```

Error Response — tidak ditemukan

```json
{
  "message": "Post #1 not found"
}
```

---

## Status Codes

| Code | Description           |
| ------| -----------------------|
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
- `media` dan `hashtags` bersifat opsional saat create, tapi setidaknya `content` atau `media` harus ada
- Update `media` / `hashtags` bersifat **replace**, bukan append
- Hashtag disimpan lowercase secara otomatis oleh server
- Pagination tersedia di `GET /posts` via query param `page` dan `limit`
- Detail post (`GET /posts/:id`) menyertakan 10 komentar terbaru secara otomatis