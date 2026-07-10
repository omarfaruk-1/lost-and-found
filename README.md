# Lost & Found

A full-stack Lost & Found web application built with the MERN stack. The platform allows users to report lost or found items, helping connect owners with the people who found their belongings through a secure and user-friendly system.

The project follows modern authentication practices using JWT, session management, and HTTP-only cookies to provide a secure user experience.

---

# Features

## Authentication

* User Registration
* Secure User Login
* JWT Authentication
* Access Token Authentication
* Refresh Token Authentication
* Session-Based Authentication
* HTTP-Only Refresh Token Cookies
* Refresh Access Token
* Get Authenticated User
* Logout from Current Device
* Logout from All Devices
* Password Hashing with bcrypt
* Centralized Error Handling

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JWT
* bcryptjs
* Cookie Parser

---

# Project Structure

```text
lost-and-found/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

# Getting Started

## Clone the Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_TOKEN=your_access_token_secret

JWT_REFRESH_TOKEN=your_refresh_token_secret

NODE_ENV=development
```

---

# Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

# Authentication Flow

1. User registers with a username, email, and password.
2. Passwords are securely hashed using bcrypt before being stored.
3. Users log in with their credentials.
4. An Access Token is generated for authenticated requests.
5. A Refresh Token is stored in an HTTP-only cookie.
6. The Refresh Token is hashed before being stored in the database.
7. Sessions are managed securely to support login from multiple devices.
8. Users can refresh expired access tokens without logging in again.
9. Users can log out from the current device or all logged-in devices.

---

# Authentication API

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | `/api/users/register`      | Register a new user         |
| POST   | `/api/users/log-in`        | Login user                  |
| GET    | `/api/users/get-me`        | Get authenticated user      |
| POST   | `/api/users/refresh-token` | Generate a new access token |
| POST   | `/api/users/log-out`       | Logout from current device  |
| POST   | `/api/users/log-out-all`   | Logout from all devices     |

---

# Upcoming Features

* Email Verification
* Forgot Password
* Password Reset
* Lost Item Management
* Found Item Management
* Image Upload
* Search & Filter
* Item Claim System
* Notifications
* Admin Dashboard

---

# Author

**MD Omar Faruk**

Computer Science & Engineering Student

Full Stack MERN Developer
