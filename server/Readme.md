## 🖥️ Backend

**Tech Stack**: Node.js / Express (or Firebase functions), MongoDB / PostgreSQL (or Firestore)
**Services & APIs:**

* User Authentication (email + guest mode)
* Plant Data Storage
* Reminder Scheduler (cron or Firebase cloud scheduler)
* Journal Entry CRUD
* Plant Library API (search + filter)
* Voice Command Parser (optional AI layer)
* Settings & Preferences Storage
* Image Upload (Cloudinary / Firebase Storage)

### 🔐 API Endpoints Overview

| Endpoint       | Method              | Purpose              |
| -------------- | ------------------- | -------------------- |
| `/auth/login`  | POST                | Authenticate user    |
| `/auth/signup` | POST                | Create account       |
| `/plants/`     | GET/POST/PUT/DELETE | Manage user’s garden |
| `/reminders/`  | GET/POST            | Manage care tasks    |
| `/journal/`    | GET/POST            | Save journal entries |
| `/library/`    | GET                 | Explore plant types  |
| `/profile/`    | GET/PUT             | Manage profile info  |

---

## 🧭 Full Feature Flow Summary

| Section                  | Purpose                       |
| ------------------------ | ----------------------------- |
| **Splash Screen**        | Entry point, branding         |
| **Login/Signup**         | Secure access                 |
| **Dashboard**            | Navigation hub                |
| **My Garden**            | Manage user-added plants      |
| **Plant Details**        | View care history, add notes  |
| **Reminders/To-Do**      | Task list & notifications     |
| **Plant Library**        | Discover and add new plants   |
| **Journal**              | Reflect and track experiences |
| **Calendar View**        | Visualize tasks and notes     |
| **Gardening Tips**       | Educational content           |
| **Voice Commands Guide** | Help with voice control       |
| **Profile**              | User info & export options    |
| **Settings**             | Accessibility & customization |

---

## ✅ Getting Started


### Backend:

```bash
npm install
npm run dev
```

Ensure environment variables are set (`.env`) for DB, storage, and auth credentials.

---