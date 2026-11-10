# Student Productivity Platform

A full-stack web application designed to help students organize their academic tasks, manage deadlines, and track their productivity in one place.

🔗 **Live Demo:** https://student-productivity-platform-rouge.vercel.app/

💻 **GitHub Repository:** https://github.com/amitgupta223025/student-productivity-platform

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing-page.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Task Management
![Task Management](./screenshots/task-management.png)

---

## ✨ Features

- **User Authentication:** Secure registration and login using JWT authentication.
- **Task Management:** Create, view, update, and delete tasks.
- **Task Priorities:** Organize tasks into High, Medium, and Low priority levels.
- **Deadline Management:** Set deadlines for individual tasks.
- **Task Status:** Mark tasks as completed or pending.
- **Search Functionality:** Search tasks by title or description.
- **Filters:** Filter tasks by priority and completion status.
- **Sorting:** Sort tasks by newest, oldest, priority, and deadline.
- **Dashboard:** View total, completed, and pending task statistics.
- **Protected Routes:** Restrict dashboard and task access to authenticated users.
- **Responsive UI:** Access the application across different screen sizes.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

### Security
- Helmet
- CORS
- express-rate-limit
- Input validation

### Deployment
- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

---

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/amitgupta223025/student-productivity-platform.git
```

```bash
cd student-productivity-platform
```

### 2. Install Frontend Dependencies

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Replace the placeholder values with your own configuration. Never commit your actual `.env` files or secrets to GitHub.

### 4. Start the Backend

From the `backend` folder:

```bash
npm start
```

The backend will run at:

`http://localhost:5000`

### 5. Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

---

## 🔐 Security Implementation

- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected API endpoints.
- User-specific task access and ownership validation.
- Input validation on API requests.
- CORS configuration.
- Helmet security headers.
- Rate limiting on authentication routes.
- Environment variables for sensitive configuration.

---

## 🚀 Future Improvements

- Offline task creation and synchronization.
- Better handling of network interruptions.
- Study reminders and notifications.
- Calendar integration.
- Productivity analytics and progress tracking.

---

## 👨‍💻 Author

**Amit Kumar Gupta**

B.Tech Student | Artificial Intelligence & Machine Learning

[GitHub](https://github.com/amitgupta223025)

---

⭐ If you find this project interesting, consider giving the repository a star!