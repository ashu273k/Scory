# 📋 Scory - Live Sports Scoring Platform

<div align="center">

![Scory Logo](https://img.shields.io/badge/Scory-Live%20Scoring-0ea5e9?style=for-the-badge&logo=trophy&logoColor=white)

**Real-time multi-sport scoring with WebSocket updates**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-success?style=for-the-badge)](https://scory-cg1v.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_Backend-Active-blue?style=for-the-badge)](https://scory.onrender.com)

</div>

---

## ✨ Quick Features

- 🔐 **JWT Authentication** with refresh tokens & HTTP-only cookies
- 🎮 **Multi-Sport Support** - Cricket, Football, Basketball, Custom
- ⚡ **Real-Time Updates** via Socket.io WebSockets
- 👥 **Collaborative Scoring** with role-based permissions
- 📱 **Responsive Design** built with Tailwind CSS & React
- 🔒 **Secure** - Password hashing, input validation, CORS protection

---

## 🚀 Tech Stack

**Frontend:** React 18 + Vite + Tailwind CSS + Axios + Socket.io Client  
**Backend:** Node.js + Express 5 + MongoDB + Mongoose + JWT + Zod  
**Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Git

### Backend Setup

```bash
cd server
npm install

# Create .env
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/scory
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_secret_min_32_chars
JWT_REFRESH_SECRET=your_secret_min_32_chars
EOF

npm run dev  # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install

# Create .env
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000
EOF

npm run dev  # Runs on http://localhost:5173
```

---

## 🎮 Usage

1. **Register/Login** to dashboard
2. **Create Game** - Choose type and name
3. **Share Room Code** - Invite others
4. **Start Scoring** - Real-time updates for all participants

### Scoring Rules
- **Cricket:** Runs (1,2,3,4,6) or Wickets
- **Football/Basketball:** Points (1,2,3)

---

## � API Endpoints

### Authentication
```
POST   /api/auth/register        - Register user
POST   /api/auth/login           - Login
POST   /api/auth/logout          - Logout
GET    /api/auth/profile         - Get profile
PATCH  /api/auth/profile         - Update profile
POST   /api/auth/refresh         - Refresh token
```

### Games
```
POST   /api/games                - Create game
GET    /api/games                - List games
GET    /api/games/:id            - Get game
POST   /api/games/join           - Join by room code
POST   /api/games/:id/leave      - Leave game
PUT    /api/games/:id/status     - Update status
PUT    /api/games/:id/score      - Update score
DELETE /api/games/:id            - Delete game
```

---

## 🏗️ Architecture

```text

Frontend (React + Vite)
    ↓ HTTPS/WebSocket
Backend (Node.js + Express)
    ↓ MongoDB Driver
Database (MongoDB Atlas)
```

**Real-time Flow:**

```text

User Action → API Request → Auth Middleware → Validation → 
Controller → Database → Socket Broadcast → Live Update
```

---

## 🔐 Security

- ✅ JWT (Access: 15min, Refresh: 7days)
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Zod input validation
- ✅ CORS protection
- ✅ HTTP-only secure cookies
- ✅ MongoDB injection protection

---

## � Deployment

### Vercel (Frontend)

```bash
# Connect GitHub repo → Set VITE_API_URL environment variable → Deploy
```

### Render (Backend)

```bash
# Connect GitHub repo → Set environment variables → Deploy
```

---

## 🎯 Future Features

- [ ] Advanced statistics & leaderboards
- [ ] Team management system
- [ ] Tournament brackets
- [ ] Push notifications
- [ ] Mobile apps (React Native)
- [ ] Live streaming integration
- [ ] Two-factor authentication
- [ ] Premium features

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## 👨‍💻 Author

**Aashu Kumar**

- 🌐 Portfolio: yourportfolio.com
- 💼 LinkedIn: linkedin.com/in/ashu273k
- 🐦 Twitter: @squishy_ashu
- 📧 Email: ashu9472.as@gmail.com

---

<div align="center">

💖 Give a ⭐️ if this project helped you!

Made with ❤️ by Ashu

</div>
