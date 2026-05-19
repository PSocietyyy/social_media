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

```http
POST /posts
```

Headers

```txt
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body

```json
{
  "content": "Hello world 🔥",
  "media": [
    {
      "url": "https://example.com/image.jpg",
      "type": "IMAGE"
    }
  ],
  "hashtags": ["nestjs", "typescript"]
}
```

Rules

* `content` dan `media` bersifat opsional
* Minimal salah satu harus diisi
* `type` media hanya menerima:

  * `IMAGE`
  * `VIDEO`
* Hashtag otomatis disimpan lowercase
* Endpoint membutuhkan authentication

Response `201`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Hello world 🔥",
    "authorId": 3,

    "author": {
      "id": 3,
      "name": "John Doe",
      "username": "john",
      "avatar": null,
      "isVerified": false
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

Error Response — content kosong

```json
{
  "message": "Post must have content or media"
}
```

---

### Latest Feed

```http
GET /posts
```

Headers

```txt
Authorization: Bearer <access_token>
```

Query Parameters

| Parameter | Type    | Default | Description       |
| --------- | ------- | ------- | ----------------- |
| `cursor`  | integer | -       | Cursor pagination |
| `limit`   | integer | 10      | Jumlah post       |

Example

```http
GET /posts?limit=10
```

```http
GET /posts?cursor=20&limit=10
```

Rules

* Menggunakan cursor pagination
* Cocok untuk infinite scroll
* Data diurutkan berdasarkan:

  * `createdAt DESC`
* Hanya menampilkan post:

  * `isDeleted = false`
  * `isShadowBanned = false`

Response `200`

```json
{
  "message": "Success",

  "data": [
    {
      "id": 22,
      "content": "Newest post",

      "author": {
        "id": 3,
        "name": "John Doe",
        "username": "john",
        "avatar": null,
        "isVerified": false
      },

      "media": [],

      "hashtags": [],

      "comments": [
        {
          "id": 8,
          "content": "Nice 🔥",

          "author": {
            "id": 2,
            "name": "Jane",
            "username": "jane",
            "avatar": null
          }
        }
      ],

      "_count": {
        "likes": 12,
        "comments": 5
      },

      "createdAt": "2026-01-02T00:00:00.000Z"
    }
  ],

  "meta": {
    "nextCursor": 22,
    "hasMore": true
  }
}
```

> Feed hanya mengambil 2 komentar terbaru per post.

---

### For You Feed (FYP)

```http
GET /posts/fyp
```

Headers

```txt
Authorization: Bearer <access_token>
```

Query Parameters

| Parameter | Type    | Default | Description       |
| --------- | ------- | ------- | ----------------- |
| `cursor`  | integer | -       | Cursor pagination |
| `limit`   | integer | 10      | Jumlah post       |

Example

```http
GET /posts/fyp?limit=10
```

Rules

* Menggunakan cursor pagination
* Diurutkan berdasarkan:

  1. `finalScore DESC`
  2. `createdAt DESC`
* Hanya menampilkan post:

  * `isDeleted = false`
  * `isShadowBanned = false`

Response `200`

```json
{
  "message": "Success",

  "data": [
    {
      "id": 15,
      "content": "Trending content 🔥",

      "author": {
        "id": 5,
        "name": "Creator",
        "username": "creator",
        "avatar": null,
        "isVerified": true
      },

      "_count": {
        "likes": 500,
        "comments": 120
      },

      "createdAt": "2026-01-02T00:00:00.000Z"
    }
  ],

  "meta": {
    "nextCursor": 15,
    "hasMore": true
  }
}
```

> Endpoint ini cocok untuk fitur infinite scroll seperti TikTok / Instagram Reels.

---

### Following Feed

```http
GET /posts/following
```

Headers

```txt
Authorization: Bearer <access_token>
```

Query Parameters

| Parameter | Type    | Default | Description       |
| --------- | ------- | ------- | ----------------- |
| `cursor`  | integer | -       | Cursor pagination |
| `limit`   | integer | 10      | Jumlah post       |

Rules

* Hanya mengambil post dari user yang difollow
* Menggunakan cursor pagination
* Diurutkan berdasarkan:

  * `createdAt DESC`

Response `200`

```json
{
  "message": "Success",

  "data": [
    {
      "id": 10,
      "content": "Post from following user",

      "author": {
        "id": 7,
        "name": "Jane Doe",
        "username": "jane",
        "avatar": null,
        "isVerified": false
      },

      "_count": {
        "likes": 20,
        "comments": 4
      }
    }
  ],

  "meta": {
    "nextCursor": 10,
    "hasMore": true
  }
}
```

---

### Trending Feed

```http
GET /posts/trending
```

Headers

```txt
Authorization: Bearer <access_token>
```

Query Parameters

| Parameter | Type    | Default | Description       |
| --------- | ------- | ------- | ----------------- |
| `cursor`  | integer | -       | Cursor pagination |
| `limit`   | integer | 10      | Jumlah post       |

Rules

* Menggunakan cursor pagination
* Hanya mengambil post dalam 24 jam terakhir
* Diurutkan berdasarkan:

  1. `viewCount DESC`
  2. `likeCount DESC`

Response `200`

```json
{
  "message": "Success",

  "data": [
    {
      "id": 99,
      "content": "Viral post 🚀",

      "_count": {
        "likes": 999,
        "comments": 200
      },

      "createdAt": "2026-01-02T00:00:00.000Z"
    }
  ],

  "meta": {
    "nextCursor": 99,
    "hasMore": true
  }
}
```

---

### Get Post By ID

```http
GET /posts/:id
```

Headers

```txt
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | ID post     |

Rules

* Endpoint otomatis menambah:

  * `viewCount +1`
* Menyertakan:

  * media
  * hashtags
  * author
  * 20 komentar terbaru
  * total likes/comments

Response `200`

```json
{
  "message": "Success",

  "data": {
    "id": 1,
    "content": "Hello world",

    "author": {
      "id": 3,
      "name": "John Doe",
      "username": "john",
      "avatar": null,
      "isVerified": false
    },

    "media": [],

    "hashtags": [],

    "comments": [
      {
        "id": 1,
        "content": "Nice 🔥",

        "author": {
          "id": 2,
          "name": "Jane",
          "username": "jane",
          "avatar": null
        }
      }
    ],

    "_count": {
      "likes": 5,
      "comments": 1
    },

    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Error Response

```json
{
  "message": "Post #1 not found"
}
```

---

### Update Post

```http
PATCH /posts/:id
```

Headers

```txt
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

  "hashtags": ["updated", "nestjs"]
}
```

Rules

* Semua field opsional
* Jika `media` dikirim:

  * semua media lama dihapus
  * diganti media baru
* Jika `hashtags` dikirim:

  * semua hashtag lama dihapus
  * diganti hashtag baru
* Hanya pemilik post yang bisa update

Response `200`

```json
{
  "message": "Success",

  "data": {
    "id": 1,
    "content": "Updated content"
  }
}
```

Error Response — bukan pemilik

```json
{
  "message": "You can only update your own post"
}
```

Error Response — post tidak ditemukan

```json
{
  "message": "Post #1 not found"
}
```

---

### Delete Post

```http
DELETE /posts/:id
```

Headers

```txt
Authorization: Bearer <access_token>
```

Rules

* Hanya pemilik post yang bisa delete

Response `200`

```json
{
  "message": "Post #1 deleted successfully",

  "data": {
    "message": "Post #1 deleted successfully"
  }
}
```

Error Response — bukan pemilik

```json
{
  "message": "You can only delete your own post"
}
```

Error Response — post tidak ditemukan

```json
{
  "message": "Post #1 not found"
}
```

---

### Infinite Scroll Flow

#### Cara Kerja Cursor Pagination

Request pertama

```http
GET /posts/fyp?limit=10
```

Response

```json
{
  "meta": {
    "nextCursor": 15,
    "hasMore": true
  }
}
```

Request berikutnya

```http
GET /posts/fyp?cursor=15&limit=10
```

Flow

```txt
Frontend request
→ Backend ambil 10 post
→ Backend kirim nextCursor
→ Frontend simpan nextCursor
→ Saat user scroll bawah:
   request lagi pakai cursor sebelumnya
→ Ulang sampai hasMore = false
```

---

### Notes

* Semua feed menggunakan cursor pagination
* Cocok untuk infinite scroll
* Lebih efisien dibanding page pagination
* Feed otomatis filter:

  * `isDeleted = false`
  * `isShadowBanned = false`
* Feed hanya mengambil 2 komentar terbaru agar query lebih ringan
* Detail post mengambil 20 komentar terbaru
* `viewCount` otomatis bertambah saat detail post dibuka
* Hashtag otomatis lowercase
* Update `media` dan `hashtags` bersifat replace, bukan append
* Sorting FYP menggunakan:

  * `finalScore`
  * `createdAt`
* Sorting trending menggunakan:

  * `viewCount`
  * `likeCount`

## Follows

### Follow User

```
POST /follows/:id
```

Headers

```
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description                 |
| --------- | ------- | --------------------------- |
| `id`      | integer | ID user yang ingin difollow |

Rules

* User tidak bisa follow dirinya sendiri
* User tidak bisa follow user yang sama dua kali
* Endpoint membutuhkan authentication

Response `201`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "followerId": 2,
    "followingId": 3,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Error Response — follow diri sendiri

```json
{
  "message": "Tidak bisa follow diri sendiri"
}
```

Error Response — sudah follow

```json
{
  "message": "Sudah follow user ini"
}
```

Error Response — user tidak ditemukan

```json
{
  "message": "User tidak ditemukan"
}
```

---

### Unfollow User

```
DELETE /follows/:id
```

Headers

```
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description                    |
| --------- | ------- | ------------------------------ |
| `id`      | integer | ID user yang ingin di-unfollow |

Rules

* User harus sudah follow target sebelumnya
* Endpoint membutuhkan authentication

Response `200`

```json
{
  "message": "Success",
  "data": {
    "message": "Berhasil unfollow"
  }
}
```

Error Response — belum follow

```json
{
  "message": "Belum follow user ini"
}
```

---

### Get Followers

```
GET /follows/followers/:id
```

Headers

```
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description    |
| --------- | ------- | -------------- |
| `id`      | integer | ID user target |

Response `200`

```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "followerId": 2,
      "followingId": 3,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "follower": {
        "id": 2,
        "name": "Admin",
        "username": "admin",
        "avatar": null
      }
    }
  ]
}
```

> Data diurutkan berdasarkan follower terbaru (`createdAt DESC`).

---

### Get Following

```
GET /follows/following/:id
```

Headers

```
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description    |
| --------- | ------- | -------------- |
| `id`      | integer | ID user target |

Response `200`

```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "followerId": 2,
      "followingId": 3,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "following": {
        "id": 3,
        "name": "John Doe",
        "username": "john",
        "avatar": null
      }
    }
  ]
}
```

> Data diurutkan berdasarkan following terbaru (`createdAt DESC`).

---

### User Profile Follow Info

Endpoint profile user otomatis menyertakan informasi follow.

#### Get User Profile

```
GET /users/:id
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
    "id": 3,
    "name": "John Doe",
    "username": "john",
    "bio": null,
    "avatar": null,
    "createdAt": "2026-01-01T00:00:00.000Z",

    "_count": {
      "followers": 1,
      "following": 0,
      "posts": 0
    },

    "posts": [],

    "isFollowing": true
  }
}
```

Field tambahan:

| Field              | Type    | Description                                 |
| --------------------| ---------| ---------------------------------------------|
| `_count.followers` | number  | Jumlah followers user                       |
| `_count.following` | number  | Jumlah following user                       |
| `isFollowing`      | boolean | Apakah current user follow profile tersebut |

> `isFollowing` dihitung berdasarkan relasi antara authenticated user dan target user profile.

## Comments

### Create Comment

```http
POST /posts/:postId/comments
```

Headers

```txt
Authorization: Bearer <access_token>
Content-Type: application/json
```

Parameters

| Parameter | Type    | Description |
| ----------| ------- | ----------- |
| `postId`  | integer | ID post     |

Request Body

```json
{
  "content": "Nice post 🔥"
}
```

Rules

- Endpoint membutuhkan authentication
- `content` wajib diisi
- Post harus ada
- Comment otomatis terhubung ke authenticated user

Response `201`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Nice post 🔥",
    "authorId": 2,
    "postId": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "author": {
      "id": 2,
      "name": "Admin",
      "username": "admin",
      "avatar": null
    }
  }
}
```

Error Response — post tidak ditemukan

```json
{
  "message": "Post not found"
}
```

---

### Get Comments by Post

```http
GET /posts/:postId/comments
```

Headers

```txt
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description |
| ----------| ------- | ----------- |
| `postId`  | integer | ID post     |

Response `200`

```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "content": "Nice post 🔥",
      "authorId": 2,
      "postId": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "author": {
        "id": 2,
        "name": "Admin",
        "username": "admin",
        "avatar": null
      }
    }
  ]
}
```

> Comment diurutkan dari yang terbaru (`createdAt DESC`)

---

### Update Comment

```http
PATCH /comments/:id
```

Headers

```txt
Authorization: Bearer <access_token>
Content-Type: application/json
```

Parameters

| Parameter | Type    | Description    |
| ----------| ------- | -------------- |
| `id`      | integer | ID comment     |

Request Body

```json
{
  "content": "Updated comment"
}
```

Rules

- Hanya pemilik comment yang bisa update
- `content` wajib diisi

Response `200`

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Updated comment",
    "authorId": 2,
    "postId": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T01:00:00.000Z"
  }
}
```

Error Response — bukan pemilik

```json
{
  "message": "You can only update your own comment"
}
```

Error Response — comment tidak ditemukan

```json
{
  "message": "Comment not found"
}
```

---

### Delete Comment

```http
DELETE /comments/:id
```

Headers

```txt
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description |
| ----------| ------- | ----------- |
| `id`      | integer | ID comment  |

Rules

- Hanya pemilik comment yang bisa delete

Response `200`

```json
{
  "message": "Comment deleted successfully",
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

Error Response — bukan pemilik

```json
{
  "message": "You can only delete your own comment"
}
```

Error Response — comment tidak ditemukan

```json
{
  "message": "Comment not found"
}
```

---

### Comment Included in Post Detail

Endpoint berikut otomatis menyertakan comment:

```http
GET /posts/:id
```

Response

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Hello world",
    "comments": [
      {
        "id": 1,
        "content": "Updated comment",
        "author": {
          "id": 2,
          "name": "Admin",
          "username": "admin",
          "avatar": null
        }
      }
    ],
    "_count": {
      "comments": 1
    }
  }
}
```

> Detail post menyertakan 20 komentar terbaru secara otomatis.
---


## Likes

### Like Post

```http
POST /likes/:postId
````

Headers

```txt
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `postId`  | integer | ID post     |

Rules

* Endpoint membutuhkan authentication
* User hanya bisa like 1 kali pada post yang sama
* Post harus tersedia
* Like otomatis terhubung ke authenticated user

Response `201`

```json
{
  "message": "Post liked",
  "data": {
    "message": "Post liked"
  }
}
```

Error Response — post tidak ditemukan

```json
{
  "message": "Post not found"
}
```

Error Response — sudah like

```json
{
  "message": "You already liked this post"
}
```

---

### Unlike Post

```http
DELETE /likes/:postId
```

Headers

```txt
Authorization: Bearer <access_token>
```

Parameters

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `postId`  | integer | ID post     |

Rules

* Endpoint membutuhkan authentication
* User harus sudah like post sebelumnya

Response `200`

```json
{
  "message": "Post unliked",
  "data": {
    "message": "Post unliked"
  }
}
```

Error Response — belum like

```json
{
  "message": "You have not liked this post"
}
```

Error Response — post tidak ditemukan

```json
{
  "message": "Post not found"
}
```

---

### Likes Count in Posts

Endpoint post otomatis menyertakan jumlah likes.

#### Get All Posts

```http
GET /posts
```

Response

```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "content": "Hello world",
      "_count": {
        "likes": 5,
        "comments": 2
      }
    }
  ]
}
```

---

#### Get Post by ID

```http
GET /posts/:id
```

Response

```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "content": "Hello world",
    "_count": {
      "likes": 5,
      "comments": 2
    }
  }
}
```

Field tambahan:

| Field             | Type   | Description          |
| ----------------- | ------ | -------------------- |
| `_count.likes`    | number | Jumlah likes post    |
| `_count.comments` | number | Jumlah comments post |

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
