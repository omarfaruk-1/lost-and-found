# Lost & Found Management System

A backend API for managing lost and found items, user claims, authentication, and admin operations.

The system allows users to post lost or found items, submit claims with supporting images, and communicate through email notifications. Admins or item owners can review claims, while the system also tracks false claims and automatically blocks users after repeated false claims.

## Features

### Authentication & Authorization

* User registration and login
* Password hashing with bcrypt
* Email verification
* JWT-based authentication
* Short-lived access tokens
* Refresh token rotation
* Refresh tokens stored as hashes in the database
* Session management for multiple devices
* Logout from current device
* Logout from all devices
* Role-based authorization
* Admin-only dashboard access
* Blocked user protection

### Lost & Found Items

* Create lost or found item posts
* Upload multiple images
* Store images using external storage service
* Search items by name
* Filter by type, category, and location
* Sort by latest, oldest, A-Z, and Z-A
* Pagination
* View a specific item
* View the current user's items
* Update item information and images
* Delete items
* Mark items as resolved after a claim is approved

### Claim Management

* Submit claims for items
* Upload supporting images with claims
* Prevent the same user from claiming the same item multiple times
* View all claims
* View personal claims
* View individual claims
* Item owners can review claims
* Admins can review claims
* Approve or reject claims
* Require a reason when rejecting a claim
* Automatically reject other pending claims when one claim is approved
* Send email notifications for new claims and approved claims

### False Claim Protection

* Track false claims for each user
* Increase the false claim count when a claim is rejected as a false claim
* Automatically block a user after 5 false claims
* Prevent blocked users from logging in
* Prevent blocked users from using existing access tokens
* Prevent blocked users from refreshing their access tokens

### Admin Dashboard

The admin dashboard provides statistics for:

* Total users
* Verified users
* Unverified users
* Lost items
* Found items
* Resolved items
* Total claims
* Approved claims
* Rejected claims
* Pending claims
* Blocked users

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer
* Multer
* Cookie Parser
* External image storage service

## Project Structure

```text
src/
├── config/        # Application configuration
├── controllers/   # Request handling and business logic
├── db/            # Database connection
├── errors/        # Custom error classes and error handling
├── middlewares/   # Authentication, authorization, upload, etc.
├── models/        # Mongoose schemas and models
├── routes/        # API route definitions
├── services/      # External services such as email and image storage
├── templates/     # Email templates
├── utils/         # Reusable utility functions
└── app.js         # Express application setup

server.js          # Server entry point
```

## Main API Routes

### Authentication

```text
POST   /api/users/register
POST   /api/users/log-in
GET    /api/users/get-me
POST   /api/users/refresh-token
POST   /api/users/log-out
POST   /api/users/log-out-all
GET    /api/users/verify-email
```

### Items

```text
POST   /api/items
GET    /api/items
GET    /api/items/my-items
GET    /api/items/:itemId
PATCH  /api/items/:itemId
DELETE /api/items/:itemId
```

### Claims

```text
GET    /api/claim
GET    /api/claim/my-claims
POST   /api/claim/:itemId
GET    /api/claim/:itemId
PATCH  /api/claim/:itemId
```

### Admin

```text
GET    /api/admin/dashboard
```

The admin dashboard requires authentication and an `admin` role.

## Authentication Flow

The application uses two JWT tokens:

### Access Token

The access token is short-lived and sent by the client through the `Authorization` header.

```text
Authorization: Bearer <access_token>
```

The access token contains the user ID, role, and session ID.

### Refresh Token

The refresh token is stored in an HTTP-only cookie.

The server stores only a SHA-256 hash of the refresh token in the session collection.

When the access token expires:

```text
Refresh Token
      ↓
Verify JWT
      ↓
Find active session
      ↓
Find user
      ↓
Check blocked status
      ↓
Generate new Access Token
      ↓
Generate new Refresh Token
      ↓
Update stored Refresh Token Hash
```

This also allows individual sessions to be revoked.

## Claim Flow

A typical claim flow looks like this:

```text
User finds an item
       ↓
Submit claim + supporting images
       ↓
Item owner receives email
       ↓
Owner/Admin reviews claim
       ↓
   ┌───────────────┐
   │               │
Approve          Reject
   │               │
   ↓               ↓
Item resolved    Reason required
   │               │
   ↓               ↓
Other pending    If false claim,
claims rejected  increase false count
   │
   ↓
Claimant receives approval email
```

If a user reaches 5 false claims, the account is automatically blocked.

## Environment Variables

Create a `.env` file and configure the required environment variables.

Example:

```env
PORT=5000
DB_URL=your_mongodb_connection_string

JWT_ACCESS_TOKEN=your_access_token_secret
JWT_REFRESH_TOKEN=your_refresh_token_secret
JWT_EMAIL_TOKEN=your_email_verification_secret

FRONTEND_URL=http://localhost:3000

MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Add any additional variables required by your image storage service.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create the `.env` file with the required configuration.

Then start the development server:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Error Handling

The application uses centralized error handling.

Custom application errors can be created with:

```js
new appError("Error message", statusCode)
```

Errors are passed to the centralized error middleware using:

```js
next(error)
```

The API returns responses in the following format:

```json
{
  "message": "Error message"
}
```

## Security

The project includes several security-related practices:

* Passwords are hashed before storing
* Access tokens are short-lived
* Refresh tokens are stored as hashes
* Refresh tokens are stored in HTTP-only cookies
* Sessions can be revoked
* Role-based authorization protects admin routes
* Email verification is required before login
* Blocked users cannot access protected functionality
* JWT errors are handled separately
* Request validation is performed before database operations

## API Response Example

Successful login:

```json
{
  "message": "User login successfully",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "role": "user",
    "isVerified": true
  },
  "accessToken": "access_token"
}
```

## Project Status

The backend currently includes the main authentication, item management, claim management, email notification, session management, and admin functionality required for a Lost & Found platform.

More features can be added later as the frontend and application requirements grow.

```
```
