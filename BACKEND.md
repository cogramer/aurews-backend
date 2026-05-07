# Aurews Backend — Handoff document

## What was set up (Person 1)

- Next.js project with TypeScript
- Prisma 7 + PostgreSQL (Supabase) for the database
- JWT-based authentication
- 3 working endpoints: register, login, /me
- CORS configured so the frontend can call this backend

---

## Getting started

### 1. Clone the repo and install dependencies

```bash
git clone <repo-url>
cd aurews-backend
npm install
```

### 2. Create your `.env` file

Create a file called `.env` in the project root (never commit this):

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres"
JWT_SECRET="aurews-super-secret-jwt-2025"
```

Ask Person 1 for the actual values — do NOT push `.env` to GitHub.

### 3. Generate the Prisma client

```bash
npx prisma generate
```

You must run this every time the schema changes.

### 4. Run the dev server

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

---

## Project structure

```ini
aurews-backend/
├── app/
│   ├── generated/prisma/     ← auto-generated, never edit manually
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   └── login/route.ts
│       └── me/route.ts
├── lib/
│   ├── db.ts        ← Prisma client singleton, import this to query the DB
│   ├── jwt.ts       ← signToken / verifyToken helpers
│   └── auth.ts      ← getUser(req) helper, import this to protect routes
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── prisma.config.ts
└── .env             ← never commit this
```

---

## The 3 files you will use in every route

### `lib/db.ts` — query the database

```ts
import { db } from '@/lib/db'

const posts = await db.post.findMany()
const user = await db.user.findUnique({ where: { id: 1 } })
```

### `lib/auth.ts` — get the logged-in user from a request

```ts
import { getUser } from '@/lib/auth'

const tokenUser = getUser(req)
// tokenUser is null if not logged in
// tokenUser is { id: number, role: "USER" | "ADMIN" } if logged in
```

### `lib/jwt.ts` — you probably won't need this directly

Already used inside the auth endpoints. Only touch it if you need to issue tokens yourself.

---

## Database schema

### User

| Field | Type | Notes |
|---|---|---|
| id | Int | auto increment |
| email | String | unique |
| password | String | bcrypt hashed |
| name | String | |
| role | Role | `USER` or `ADMIN` |
| createdAt | DateTime | |

### Post

| Field | Type | Notes |
|---|---|---|
| id | Int | auto increment |
| title | String | |
| content | String | |
| thumbnail | String? | optional |
| authorId | Int | foreign key → User |
| categoryId | Int | foreign key → Category |
| createdAt | DateTime | |
| updatedAt | DateTime | auto updated |

### Category

| Field | Type | Notes |
|---|---|---|
| id | Int | auto increment |
| name | String | unique, e.g. "Economy" |
| slug | String | unique, e.g. "economy" |

---

## Existing endpoints

### POST `/api/auth/register`

No auth required.

Request body:

```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "John"
}
```

Response:

```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "John", "email": "user@example.com", "role": "USER" }
}
```

---

### POST `/api/auth/login`

No auth required.

Request body:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Response: same shape as register.

---

### GET `/api/me`

Requires auth header.

```sh
Authorization: Bearer <token>
```

Response:

```json
{
  "id": 1,
  "name": "John",
  "email": "user@example.com",
  "role": "USER",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## How to write a new route

### Public route (no login needed)

Create `app/api/posts/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const posts = await db.post.findMany({
    include: { category: true, author: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}
```

---

### Protected route (login required)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // 1. check if logged in
  const tokenUser = getUser(req)
  if (!tokenUser)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. do your thing
  const body = await req.json()
  const post = await db.post.create({
    data: { ...body, authorId: tokenUser.id }
  })
  return NextResponse.json(post, { status: 201 })
}
```

---

### Owner-only check (user can only edit their own post)

```ts
const post = await db.post.findUnique({ where: { id: Number(params.id) } })
if (!post)
  return NextResponse.json({ error: 'Not found' }, { status: 404 })

if (post.authorId !== tokenUser.id)
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
```

---

## Who is building what

| Person | Routes |
|---|---|
| Person 1 (done) | `/api/auth/register`, `/api/auth/login`, `/api/me` |
| Person 2 | `GET /api/posts`, `GET /api/posts/:id`, `GET /api/categories` |
| Person 3 | `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id` |

---

## Testing with Postman

1. Call `POST /api/auth/login` to get a token
2. In the **Tests** tab of the login request, add:

```js
pm.environment.set("token", pm.response.json().token)
```

3. In any protected request, add header:
   - Key: `Authorization`
   - Value: `Bearer {{token}}`

---

## If the schema changes

If Person 1 updates `prisma/schema.prisma`, everyone must run:

```bash
npx prisma generate
```

If there's a new migration:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Common errors

| Error | Fix |
|---|---|
| `PrismaClientInitializationError` | Run `npx prisma generate` |
| `401 Unauthorized` | Missing or wrong `Authorization` header |
| `Cannot find module '../app/generated/prisma/client'` | Run `npx prisma generate` |
| `JWT_SECRET is undefined` | Your `.env` file is missing or in the wrong folder |
