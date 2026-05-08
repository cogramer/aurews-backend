# Testing Aurews Backend with Postman

Make sure your backend is running locally (`npm run dev`) before starting these tests. All requests should be made to `http://localhost:3000`.

## 1. Authentication (Login)
Before you can create, update, or delete posts, you need an Admin token.
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "admin@aurews.com",
  "password": "admin123"
}
```
**Action:** Send the request. Copy the long `"token"` string from the response. You will use this in the **Authorization** tab (as a Bearer Token) for all protected routes below.

---

## 2. Fetch Paginated Posts (`GET /api/posts`)
Test fetching posts with pagination and category filters.
- **Method:** `GET`
- **URL:** `/api/posts?limit=3&page=1`
- **Auth:** None required.
- **Action:** Send the request. You should receive a list of up to 3 posts, along with a `meta` object containing the `hasMore` flag.
- *Try adding a category:* `/api/posts?category=tech&limit=2`

---

## 3. Create a New Post (`POST /api/posts`)
- **Method:** `POST`
- **URL:** `/api/posts`
- **Auth:** Bearer Token (paste your token here).
- **Body (JSON):**
```json
{
  "title": "My Postman Test",
  "slug": "my-postman-test",
  "metaDescription": "Testing via Postman",
  "content": "<p>This is a test post.</p>",
  "categoryId": 1
}
```
**Action:** Send the request. You should get a `201 Created` response.

---

## 4. Fetch a Single Post (`GET /api/posts/[slug]`)
- **Method:** `GET`
- **URL:** `/api/posts/my-postman-test`
- **Auth:** None required.
- **Action:** Send the request. You should receive the exact post you just created.

---

## 5. Update a Post (`PUT /api/posts/[slug]`)
- **Method:** `PUT`
- **URL:** `/api/posts/my-postman-test`
- **Auth:** Bearer Token.
- **Body (JSON):**
```json
{
  "title": "UPDATED: My Postman Test",
  "content": "<p>I updated this content in Postman.</p>"
}
```
**Action:** Send the request. You should see the updated title in the response.

---

## 6. Delete a Post (`DELETE /api/posts/[slug]`)
- **Method:** `DELETE`
- **URL:** `/api/posts/my-postman-test`
- **Auth:** Bearer Token.
- **Action:** Send the request. You should get a `"Post deleted successfully"` message.

---

