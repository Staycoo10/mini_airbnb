const express = require("express");
const session = require("express-session");
const cors = require("cors");
const configureMiddleware = (app) => {
  // CORS - permite atât proxy cât și direct access
  app.use(cors({
    origin: [
      'http://localhost:5173',      // Vite dev server
      'http://localhost:3000',      // Backend direct
      'http://127.0.0.1:5173',      // Alternative localhost
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // false pentru development
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      },
      name: 'sessionId' // Custom name (opțional)
    })
  );

  // Request logging
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });
  }
};

module.exports = configureMiddleware;