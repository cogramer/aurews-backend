# Contact Page Strategy: Backend Route (Option 1)

This document outlines the plan for implementing a secure, robust Contact Page where messages are handled entirely by your own Next.js backend.

## The Goal
When a user fills out the contact form on the frontend, the data is sent to your backend. The backend will securely validate the data, save it to your PostgreSQL database (so you can view it later in an admin panel), and optionally send you an email notification.

---

## Step 1: Database Schema Update
First, we need a place to store these messages in your database so they are never lost.

You will need to update your `prisma/schema.prisma` file with a new model:

```prisma
model ContactMessage {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  isRead    Boolean  @default(false) // Useful for an admin dashboard later!
  createdAt DateTime @default(now())
}
```
*After adding this, you would run `npx prisma migrate dev --name add_contact_message`.*

---

## Step 2: Create the API Route
You will create a new file at `app/api/contact/route.ts`. This route will listen for `POST` requests from your frontend form.

**Basic Logic Flow:**
1. Receive the JSON body (`name`, `email`, `message`).
2. Validate that no fields are empty and that the email is a valid format.
3. Use Prisma to save the message to the database:
   ```typescript
   const newMessage = await db.contactMessage.create({
       data: { name, email, message }
   });
   ```
4. Return a `201 Created` status to the frontend.

---

## Step 3: Email Notifications (Optional but Recommended)
Saving to the database is great, but you probably want to be notified immediately when someone contacts you. 

Inside that same `app/api/contact/route.ts`, right after saving to the database, you can use a library to send an email to yourself.

**Popular Tools:**
*   **Resend (Recommended):** Extremely modern, specifically built for Next.js and React. Very generous free tier.
*   **Nodemailer:** The classic Node.js library. Connects directly to any SMTP server (like a Gmail account).

*Security Note: Because this happens on the server, your private API keys for Resend or your Gmail passwords will be safely hidden in your `.env` file.*

---

## Step 4: The Frontend Integration
When you build the frontend, your form will simply use `fetch` to send a POST request.

```javascript
// Example Frontend Submission
const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello!"
    })
});

if (response.ok) {
    alert("Message sent successfully!");
}
```

## Why this approach is the best
1. **Security:** No API keys are exposed to the browser.
2. **Data Ownership:** You own the messages in your own database forever.
3. **Flexibility:** You can easily build an "Admin Dashboard" later to reply to these messages because they are already stored in Prisma!
