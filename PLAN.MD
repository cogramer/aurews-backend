# Aurews Updated Build Plan

## 1. Overview
This document outlines the development plan and requirements for the Aurews project. The architecture involves a Next.js (TypeScript) backend with a Prisma + PostgreSQL (Supabase) database. Authentication is managed via JWT. 

## 2. Routes & Terminology
- All content items are referred to as **Posts** (formerly Articles).
- **API Endpoints:**
  - `GET /api/posts` - Fetch all posts
  - `POST /api/posts` - Create a new post
  - `GET /api/posts/:id` - Fetch a specific post
  - `PUT /api/posts/:id` - Update a post
  - `DELETE /api/posts/:id` - Delete a post
  - `GET /api/categories` - Fetch all categories
- **Frontend / Dashboard Routes:**
  - `/dashboard/posts/new` - Route for creating a new post
  - `/dashboard/posts/[id]/edit` - Route for editing an existing post
- **Components & Folders:**
  - `PostCard`, `PostEditor`, `PostBody`, etc.

## 3. Roles & Permissions
The system uses a simplified two-tier role system: `USER` and `ADMIN`.
- **USER:** All registered users start with the `USER` role. They have the ability to write and publish posts immediately (previously deferred to a "Contributor" role). They can only edit or delete their **own** posts.
- **ADMIN:** The `ADMIN` role is fully active. Admin users have elevated privileges.
- **Ownership Checks:** API endpoints that modify or delete resources will verify ownership. However, if `user.role === 'ADMIN'`, the ownership check is bypassed, allowing admins to modify or delete any post.

## 4. Database Schema Alignment
The application adheres strictly to the existing `schema.prisma` implementation.

### Models
- **User:** Contains `id`, `email`, `password`, `name`, `role` (Enum: `USER` | `ADMIN`), and relation to `Post`.
- **Post:** Represents the content entity. Contains `id`, `title`, `content`, `thumbnail`, `authorId`, `categoryId`, and timestamps. 
- **Category:** Used for classifying posts. Contains `id`, `name`, `slug`, and relation to `Post`. 

*Note: Previous references to `PostTopic` and `PostTag` (or `ArticleTopic` / `ArticleTag`) have been omitted to align exactly with the current `schema.prisma`, which uses a `Category` model instead.*

## 5. Implementation Details

### API Ownership Bypass Logic
When updating or deleting a post:
```typescript
const tokenUser = getUser(req)
// ...
const post = await db.post.findUnique({ where: { id: Number(params.id) } })

// Allow if user is ADMIN, or if user is the author
if (post.authorId !== tokenUser.id && tokenUser.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Components Naming Convention
Ensure all frontend components and hooks reflect the "Post" terminology (e.g., `usePosts`, `PostForm`, `PostList`). No references to "Article" should remain in the codebase.
