# Document Management System (React Assignment)

## Project Overview

This project is a **Document Management System** built using **React.js** and **React-Bootstrap**.
It allows users to **login via OTP**, **upload documents**, **search documents**, and **preview/download files**. The application is fully protected with **route-based authentication**, ensuring only logged-in users can access Upload and Search pages.

**Purpose:**
The project simulates a lightweight document management system, similar to platforms used in offices or organizations for storing and retrieving documents efficiently.

---

## Features

1. **Login with OTP (Demo Mode)**

   - Enter mobile number and get OTP (demo bypass).
   - Validates OTP and stores a token in localStorage.

2. **Protected Routes**

   - Upload and Search pages are accessible only after login.
   - Logout option clears the token and redirects to the login page.

3. **Upload Documents**

   - Select **Major Head** and **Minor Head** dynamically.
   - Pick **document date**.
   - Add **tags** for better searchability.
   - Upload **PDFs and images** only with file validation.
   - Displays success/error messages on upload.

4. **Search Documents**

   - Filter by **Major Head, Minor Head, Tags, and Date range**.
   - Display results in a **table** with file details and remarks.
   - Options to **preview** (PDF/image) or **download** individual files.
   - Option to **download all results as ZIP** (simulation).

5. **Responsive Design**

   - Fully responsive layout using **Bootstrap**.
   - Navbar collapses into hamburger menu on smaller screens.

6. **State Management**

   - Application state managed with React's **useState** and **useEffect** hooks.
   - Token state persists in localStorage for session management.

---

## Project Structure

````
src/
 ├── components/
 │    └── Navbar.jsx
 ├── pages/
 │    ├── Login.jsx
 │    ├── Dashboard.jsx
 │    ├── Upload.jsx
 │    └── Search.jsx
 ├── App.jsx
 ├── main.jsx


---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm start
```

- The app will run at `http://localhost:5173` (or a similar port as indicated in the terminal).
- The login page is displayed first. Enter any mobile number and use **123456** OTP in demo mode.

### 4. Build for production

```bash
npm run build
```

- Generates optimized production-ready files in the `dist/` folder (for Vite).

### 5. Testing

- Manual testing is recommended:

  - Login/logout flows
  - Upload and search functionality
  - File preview and download buttons

- No automated tests are included in this assignment.

---

## Usage

1. **Login:** Enter mobile number → Get OTP → Validate OTP.
2. **Upload Document:** Fill required fields → Choose file → Upload.
3. **Search Document:** Apply filters → Click Search → Preview or download files.
4. **Logout:** Click **Logout** in the navbar to return to the login page.

---

## Notes

- **Demo Mode:** OTP validation is bypassed; you can use any number and OTP **123456**.
- **File Upload Restrictions:** Only `.pdf`, `.png`, `.jpg`, `.jpeg` allowed.
- **Backend APIs:** Example endpoints provided for demonstration. Replace `token` headers with actual backend tokens if connecting to a live API.

---
