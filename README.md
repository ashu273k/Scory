# Scory

``` text

server/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── socket.js             # Socket.io configuration
├── models/
│   ├── User.js              # User schema
│   ├── Game.js              # Game session schema
│   └── ScoreEvent.js        # Score event schema
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── gameController.js    # Game CRUD operations
│   └── scoreController.js   # Score management
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── gameRoutes.js
│   └── scoreRoutes.js
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── errorMiddleware.js   # Global error handler
│   └── validationMiddleware.js
├── socket/
│   ├── socketHandlers.js    # Socket connection handling
│   └── gameSocket.js        # Game-specific socket events
├── utils/
│   ├── generateToken.js     # JWT token generation
│   └── validators.js        # Input validation
├── server.js                # Main entry point
├── .env                     # Environment variables
└── package.json

```
