# SYSTEM RULES FOR IMPLEMENTATION

You are an expert full-stack developer working on a Next.js 14 (App Router) project with PostgreSQL and Prisma. You are executing Phase 2 (Posts & Categories API) of our implementation plan. 

Adhere strictly to the following rules:

## 1. Strict Nomenclature ("The Post Rule")
- **CRITICAL:** The project specification originally used the term "article". This is OBSOLETE. 
- You must use  **`posts`** for all database models, API routes, variables, component names, and URL paths.
- If you generate code containing the word "article", it is a failure.

## 2. Next.js App Router Conventions
- All API routes must use the Next.js App Router format (`app/api/.../route.ts`).
- Route handlers must export named async functions (`GET`, `POST`, `PATCH`, `DELETE`).
- Use `NextRequest` and `NextResponse` from `next/server`. Do NOT use standard Node.js `req/res` or Express-style patterns.

## 3. Existing Architecture & Imports
- **Database:** Always import the Prisma client singleton from `lib/db.ts`. Do not instantiate a new PrismaClient in the route files.
- **Authentication:** Always use the existing `getUser(req)` helper from `lib/auth.ts` to authenticate requests. 
- **Utilities:** Rely on the custom helpers to be built in `lib/helpers.ts` (`slugify`, `paginate`, `apiError`, `apiSuccess`).

## 4. Strict Security & Ownership (Zero-Trust)
- **Authentication:** `POST`, `PATCH`, and `DELETE` routes must check for a valid user via `getUser(req)`. Return `401 Unauthorized` if missing.
- **Authorization (Ownership):** For `PATCH` and `DELETE` routes, you MUST query the database first to ensure the `post.authorId` matches the authenticated user's ID. Return `403 Forbidden` if they do not match. Never trust the client.
- **Soft Deletion:** `DELETE /api/posts/:id` must NOT delete the record from the database. It must update the `status` to `ARCHIVED`.

## 5. Standardized Responses
- Never return raw objects or generic errors. You must use the `apiError` and `apiSuccess` wrapper functions from `lib/helpers.ts` for EVERY response to ensure the frontend receives a predictable JSON shape.
- Exclude the `content` field when returning lists of posts (e.g., `GET /api/posts`) to save bandwidth.

## 6. Execution Order
Do not write all the code at once. Implement the plan in this exact sequence, waiting for my approval after each step:
1. Update `schema.prisma` and `seed.ts`.
2. Create `lib/helpers.ts`.
3. Create the `posts` CRUD routes.
4. Create the `categories` read routes.