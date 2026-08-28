# 🔎 FindBack — Lost & Found Management System

FindBack is a full-stack **Lost & Found Management System** that helps users report lost or found items, submit claims with supporting evidence, and manage the recovery process securely.

Users can create lost or found item reports, upload images, search and filter reports, submit claims, and receive email notifications. Item owners can review submitted claims and approve or reject them. Once a claim is approved, the item is automatically marked as **resolved**, and other pending claims are automatically rejected.

The system also includes JWT authentication, refresh token rotation, session management, role-based authorization, false-claim protection, image storage, pagination, and an admin dashboard.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Authentication Architecture](#-authentication-architecture)
- [Item Management](#-item-management)
- [Claim Management](#-claim-management)
- [Claim Approval Flow](#-claim-approval-flow)
- [False Claim Protection](#-false-claim-protection)
- [Email Notification Flow](#-email-notification-flow)
- [Admin Dashboard](#-admin-dashboard)
- [Search, Filtering, Sorting & Pagination](#-search-filtering-sorting--pagination)
- [Security](#-security)
- [API Routes](#-api-routes)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Application Workflow](#-application-workflow)
- [Validation & Error Handling](#-validation--error-handling)
- [Responsive Frontend](#-responsive-frontend)
- [Testing](#-testing)
- [Project Status](#-project-status)
- [Future Improvements](#-future-improvements)
- [Conclusion](#-conclusion)

---

## 🧭 Overview

The main goal of FindBack is to provide a structured and secure platform for handling lost and found reports, instead of relying on informal communication (Facebook groups, word of mouth, etc.).

With FindBack, a user can:

1. Report a lost or found item
2. Browse available reports
3. Search and filter items
4. Submit a claim with supporting evidence
5. Let the item owner review the claim
6. Approve or reject the claim
7. Automatically resolve the item after approval
8. Get notified through email at each important step

The system also protects against repeated false claims by tracking rejected false claims and automatically blocking users after reaching a configured threshold.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login
- Password hashing with `bcryptjs`
- Email verification
- JWT-based authentication with short-lived access tokens
- Refresh token rotation
- Refresh tokens stored as SHA-256 hashes (never raw)
- HTTP-only refresh token cookies
- Multiple device/session management
- Current-device logout & logout from all devices
- Session revocation
- Role-based authorization (user / admin)
- Blocked user protection
- Protected API routes
- Frontend authentication state management

### 📦 Lost & Found Items
- Create lost item reports
- Create found item reports
- Upload multiple images (external image storage)
- View item details
- View current user's own items
- Edit / delete own reports (ownership-protected)
- Mark items as resolved automatically after claim approval
- Prevent claims on resolved items
- Prevent users from claiming their own items

### 🔍 Search & Discovery
- Search by item name or location
- Case-insensitive & partial location matching
- Filter by Lost / Found
- Filter by category
- Sort: Newest first, Oldest first, Name A–Z, Name Z–A
- Pagination with configurable page & limit
- Multiple filters can be combined

### 📝 Claims
- Submit claims with proof images and descriptions
- Select claim category (validated against item category)
- Prevent duplicate claims and self-claims
- Prevent claims on resolved items
- View personal claims and individual claim details
- Item owners and admins can review claims
- Approve / reject claims (rejection reason required)

**Supported rejection reasons:**

| Reason | Meaning |
|---|---|
| `insufficient_proof` | Claimant didn't provide enough evidence |
| `wrong_item` | Claimed item doesn't match |
| `false_claim` | Claim was fraudulent |
| `another_claim_approved` | A different claim was already approved |

### 🚫 False Claim Protection
- Tracks false claims per user
- Increments false-claim count after a `false_claim` rejection
- Automatically blocks users after **5** false claims
- Blocked users can't log in or access protected APIs
- Existing sessions of blocked accounts are also protected against

### 📧 Email Notifications
- Email verification
- New claim notification → item owner
- Claim approval notification → claimant

### 📊 Admin Dashboard
Provides live statistics for:
- Users: total, verified, unverified, blocked
- Items: lost, found, resolved
- Claims: total, pending, approved, rejected

---

## 🏗 System Architecture

FindBack follows a clean **frontend / backend** separation:

```
                         FindBack
                            │
              ┌─────────────┴─────────────┐
              │                           │
          Frontend                    Backend API
          (React)                   (Express.js)
              │                           │
           Axios                     Controllers
              │                           │
        React Router                   Services
              │                           │
          Components                   Models
              │                           │
            Hooks                     MongoDB
              │                           │
              └─────────────┬─────────────┘
                            │
                    External Services
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Image Storage                Email Service
```

### High-Level Request Flow

```
Browser
   │  HTTP Request
   ▼
React Frontend
   │  Axios
   ▼
Express API
   ├──▶ Authentication Middleware
   ├──▶ Authorization Middleware
   ├──▶ Controller
   ├──▶ Service Layer
   └──▶ Mongoose Model
   ▼
MongoDB
```

External services used where required:

```
Backend
   ├──▶ Image Storage Service
   └──▶ SMTP / Nodemailer
```

---

## 🔑 Authentication Architecture

FindBack uses short-lived **access tokens** together with **refresh tokens** and **server-side session management**.

### Access Token
- Short-lived JWT
- Sent via header: `Authorization: Bearer <access_token>`
- Contains: User ID, Role, Session ID

### Refresh Token
- Stored in an **HTTP-only cookie**
- The raw refresh token is **never stored** in the database — only its hash:

```
Refresh Token → SHA-256 Hash → Stored in Session
```

This reduces the risk of exposing usable refresh tokens if the database is compromised.

### Refresh Token Rotation

```
Access Token Expires
        │
        ▼
Client sends Refresh Token
        │
        ▼
Verify Refresh JWT → Find Session → Check Session Status
        │
        ▼
Find User → Check Blocked Status
        │
        ▼
Generate New Access Token
        │
        ▼
Generate New Refresh Token
        │
        ▼
Update Stored Refresh Token Hash
```

### Session Management

Each login can create a separate session — this lets the app manage multiple devices independently:

```
                    User
                     │
          ┌──────────┼──────────┐
          │          │          │
       Session A  Session B  Session C
       Laptop     Mobile     Browser
```

**Current-device logout:** current session → `revoked = true` → refresh token can't be reused.

**Logout from all devices:** every active session (A, B, C, ...) is revoked at once.

---

## 📦 Item Management

Users can create reports for both lost and found items.

```
                    Item Report
                        │
              ┌─────────┴─────────┐
              │                   │
             Lost               Found
              │                   │
        Lost item report    Found item report
```

Each report can contain: item name, type, category, description, location, date, contact information, multiple images, and status.

**Possible item states:**

```
Active → Claim Submitted → Claim Approved → Resolved
```

### Item Ownership Protection

Users can modify or delete **only** their own reports — enforced on the **backend**, not just the UI:

| Action | Own Item | Other's Item |
|---|:---:|:---:|
| Edit | ✅ | ❌ |
| Delete | ✅ | ❌ |

---

## 📋 Claim Management

A user can submit a claim for another user's item. A claim contains: item reference, claimant, category, description, supporting images, status, and a rejection reason (when applicable).

**Simplified claim state flow:**

```
              Pending
                │
        ┌───────┴───────┐
        ▼               ▼
    Approved          Rejected
        │               │
        ▼               ▼
    Resolved       Reason Stored
```

### Claim Validation

Before a claim is created, the backend checks:

```
Submit Claim → Validate Item ID → Required Fields? → Item Exists?
    → Item Resolved? → Claim Category Matches Item? → Already Claimed?
    → User Is Owner? → Validate Images → Create Claim
```

**Category matching example:**

| Item Category | Claim Category | Result |
|---|---|---|
| Bag | Bag | ✅ Valid |
| Bag | Wallet | ❌ Rejected |

**Duplicate claim protection:** a user can't submit a second claim on the same item — the API returns an error.

**Self-claim protection:** the owner of an item cannot claim their own report; other users can claim normally.

---

## ✅ Claim Approval Flow

When an item owner approves a claim:

```
                 Pending Claim
                       │
                       ▼
                 Owner Reviews
                       │
                       ▼
                    Approve
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   Claim = Approved          Item = Resolved
          │                         │
          └────────────┬────────────┘
                        ▼
             Other Pending Claims
                        │
                        ▼
                    Rejected
                        │
                        ▼
         reason = another_claim_approved
                        │
                        ▼
              Approval Email → Claimant
```

Once an item becomes resolved, any **new** claim submitted on it is automatically rejected.

### Claim Rejection Flow

```
Pending Claim → Owner Reviews → Reject → Reason Required
      │                  │                   │
      ▼                  ▼                   ▼
insufficient_proof   wrong_item          false_claim
      │                  │                   │
      ▼                  ▼                   ▼
  Rejected            Rejected         False count +1
                                              │
                                              ▼
                                       Count reaches 5?
                                              │
                                              ▼
                                          Block User
```

A claim can also be auto-rejected with reason `another_claim_approved` when a different claimant has already been approved.

---

## 🛡 False Claim Protection

```
False Claim → falseClaimCount + 1 → Is count ≥ 5?
                                        │
                                   ┌────┴────┐
                                  No         Yes
                                   │          │
                                Continue   Block User
```

**After blocking, the user can no longer:**
- ❌ Log in
- ❌ Access protected APIs
- ❌ Continue any authenticated protected operation

---

## 📧 Email Notification Flow

**Email Verification**
```
Register → Verification Email → User Clicks Link → Email Verified → Login Allowed
```

**New Claim Notification**
```
User submits claim → Claim Created → Item Owner → New Claim Email
```

**Approval Notification**
```
Claim Approved → Item Resolved → Claimant → Approval Email
```

---

## 🛠 Admin Dashboard

```
Admin → Authentication → Role Check → Admin Dashboard
```

**Dashboard statistics:**

```
Users              Items              Claims
├── Total          ├── Lost           ├── Total
├── Verified       ├── Found          ├── Pending
├── Unverified     └── Resolved       ├── Approved
└── Blocked                           └── Rejected
```

---

## 🔎 Search, Filtering, Sorting & Pagination

### Search
Search can be performed by **item name** or **location**.

Location search supports **case-insensitive** and **partial** matching. For example, a stored location like `Dhaka New Market` matches all of: `dhaka`, `DHAKA`, `DhAkA`, `New Market`.

### Filters

| Filter | Options |
|---|---|
| Type | Lost, Found |
| Category | Phone, Bag, Document, Wallet, Electronics, Jewelry, Others |

### Sorting
- Newest First
- Oldest First
- Name A–Z
- Name Z–A

### Pagination

Supports `page` and `limit` query params:

```
Page 1 → Items 1–10
Page 2 → Items 11–20
Page 3 → Items 21–30
```

Example pagination metadata:

```json
{
  "count": 10,
  "page": 1,
  "limit": 10,
  "totalItems": 50,
  "totalPage": 5
}
```

---

## 🌐 API Routes

### Authentication
```
POST   /api/users/register
POST   /api/users/log-in
GET    /api/users/get-me
POST   /api/users/refresh-token
POST   /api/users/log-out
POST   /api/users/log-out-all
GET    /api/users/verify-email
```

### Items
```
POST   /api/items
GET    /api/items
GET    /api/items/my-items
GET    /api/items/:itemId
PATCH  /api/items/:itemId
DELETE /api/items/:itemId
```

### Claims
```
GET    /api/claim
GET    /api/claim/my-claims
POST   /api/claim/:itemId
GET    /api/claim/:itemId
PATCH  /api/claim/:itemId
```

### Admin
```
GET    /api/admin/dashboard
```
> Requires authentication **+** `admin` role.

### API Response Format

**Successful login response:**

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

**Typical error response:**

```json
{
  "message": "Error message"
}
```

---

## 🔒 Security

| Area | Practice |
|---|---|
| **Passwords** | Hashed with `bcryptjs`; never stored in plain text |
| **JWT** | Short-lived access tokens; rotated refresh tokens; refresh tokens hashed and stored in HTTP-only cookies |
| **Sessions** | Stored server-side; revocable; revoked tokens can't be reused |
| **Authorization** | Protected routes require auth; admin routes require `admin` role; users can't modify/delete others' items |
| **Blocked users** | Can't log in, access protected APIs, or continue authenticated operations |
| **Claims** | Duplicate & self-claims blocked; resolved items can't be claimed; category must match; rejection reason required; false claims tracked |

---

## ⚠️ Validation & Error Handling

The backend uses **centralized error handling**.

Custom application errors are created using:

```js
new appError("Error message", statusCode)
```

Errors are passed to the centralized error middleware:

```js
next(error)
```

**Examples of validation covered:**
- Invalid Object ID
- Missing required fields
- Invalid category
- Item not found
- Already claimed
- Resolved item
- Unauthorized access
- Blocked user
- Invalid JWT

---

## 🧰 Tech Stack

**Frontend**
- React
- React Router
- Axios
- Lucide React (icons)
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Nodemailer
- Multer
- Cookie Parser

**External Services**
- External image storage service
- SMTP email service

---

## 📁 Project Structure

### Backend
```
src/
├── config/         → Application configuration
├── controllers/     → Request handling & business logic
├── db/               → Database connection
├── errors/           → Custom errors and error handling
├── middlewares/       → Authentication, Authorization, Upload, etc.
├── models/             → Mongoose models and schemas
├── routes/              → API route definitions
├── services/             → Email service, Image storage service
├── templates/             → Email templates
├── utils/                  → Shared utility functions
└── app.js                   → Express application setup

server.js                     → Server entry point
```

### Frontend
```
frontend/
├── node_modules/
├── public/
├── src/
│   ├── components/     → Reusable UI, Claim components, shared components
│   ├── context/         → React context providers (e.g. auth state)
│   ├── hooks/             → Custom React hooks
│   ├── pages/              → Auth, Dashboard, Items, Claims, Admin
│   ├── services/             → API service functions
│   ├── styles/                 → CSS files
│   ├── utils/                    → Shared frontend utilities
│   ├── App.jsx                     → Application root
│   ├── config.js                     → Frontend configuration
│   └── main.jsx                        → React entry point
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

---

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

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

Also add the required credentials for your external image storage service.

> ⚠️ **Never commit `.env` files or production secrets to the repository.**

---

## 🚀 Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd <project-folder>
```

**2. Install dependencies**
```bash
npm install
```
> If the frontend is maintained separately, install its dependencies from the frontend directory as well.

**3. Configure environment variables**

Create the `.env` file and fill in the required values (see [Environment Variables](#-environment-variables)).

**4. Start the development server**
```bash
npm run dev
```

**5. Start the production server**
```bash
npm start
```

---

## 🔄 Application Workflow

```
                    Register
                       │
                       ▼
               Email Verification
                       │
                       ▼
                     Login
                       │
                       ▼
                   Dashboard
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Create Item          Browse Items
             │                   │
             │             Search / Filter
             │             Sort / Pagination
             │                   │
             └─────────┬─────────┘
                        ▼
                  Submit Claim
                        │
                        ▼
                 Upload Proof
                        │
                        ▼
                 Owner Reviews
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          Approve                Reject
             │                     │
             ▼                     ▼
       Item Resolved         Reason Required
             │                     │
             ▼                     ▼
  Other Claims Rejected      False Claim Count
             │                     │
             ▼                     ▼
       Approval Email        Auto Block at 5
```

### Frontend Behavior

The frontend includes:
- Responsive, authentication-aware navigation
- User dashboard, item browsing/creation/editing/deletion
- Claim submission, list, details, and review
- Search, filters, sorting, and pagination
- Loading, error, and empty states
- Responsive claim modal
- Logout & logout-all-devices (with a confirmation step)

**Account menu:**
```
User
 ├── Log out
 └── Log out all devices
```

---

## 📱 Responsive Frontend

Designed and tested for **Desktop**, **Tablet**, and **Mobile**, covering:

- Navbar & mobile navigation
- Item listings & item details
- Search and filters
- Claim forms & claim modals
- Dashboard
- Account menu

---

## ✅ Testing

Main application workflows have been manually tested:

| Feature | Status |
|---|:---:|
| Authentication | ✅ |
| Email Verification | ✅ |
| Login / Logout | ✅ |
| Dashboard | ✅ |
| Create / Edit / Delete Item | ✅ |
| Ownership Protection | ✅ |
| Search / Location / Type / Category Filter | ✅ |
| Sorting | ✅ |
| Pagination | ✅ |
| Combined Filters | ✅ |
| Claim Submission | ✅ |
| Duplicate Claim Protection | ✅ |
| Self Claim Protection | ✅ |
| Claim Review / Approval / Rejection | ✅ |
| Automatic Resolution | ✅ |
| Automatic Rejection | ✅ |
| False Claim Protection | ✅ |
| Blocked User Protection | ✅ |
| Email Notifications | ✅ |
| Admin Dashboard | ✅ |
| Image Upload | ✅ |
| Empty / Invalid Item States | ✅ |
| Responsive UI | ✅ |
| Logout All Devices | ✅ |

---

## 📌 Project Status

FindBack currently contains the core functionality required for a Lost & Found Management System, including:

- User authentication & email verification
- JWT access/refresh token flow with rotation
- Session management (per-device logout & logout-all)
- Role-based authorization & blocked-user protection
- Lost/found item management with multi-image upload
- Search, location/type/category filtering, sorting, pagination
- Claim submission, validation, review, approval & rejection
- Automatic item resolution & competing-claim rejection
- False-claim tracking with automatic blocking
- Email notifications
- Admin dashboard
- Responsive frontend
- Centralized backend error handling

---

## 🔮 Future Improvements

- [ ] Password reset flow
- [ ] User profile management
- [ ] Notification preferences
- [ ] Additional admin moderation tools
- [ ] More detailed analytics
- [ ] Improved communication between claimants and item owners
- [ ] Automated unit and integration test coverage
- [ ] Additional monitoring and logging

---

## 🏁 Conclusion

FindBack was built to model a **realistic Lost & Found workflow**, not just basic CRUD functionality. The project combines:

**Authentication + Session Security + Item Management + Search/Filtering/Pagination + Claim Verification + Email Notifications + False Claim Protection + Role-Based Authorization + Admin Dashboard**

The architecture keeps authentication, business logic, database operations, external services, and frontend responsibilities separated — so the application can be extended as new requirements come in.