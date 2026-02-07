const express = require("express");
const cors = require("cors");

const configureMiddleware = (app) => {
  // Configurare CORS
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = configureMiddleware;