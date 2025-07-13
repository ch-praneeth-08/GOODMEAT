const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./config/logger');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. CORE MIDDLEWARE ---

// Allow local and deployed frontend origins
const allowedOrigins = [
  'http://localhost:5173',                     // Local React dev server
  'https://goodmeat.vercel.app/'           // ✅ Replace with your actual Vercel domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// --- 2. SESSION MIDDLEWARE ---

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24                     // 1 day
  }
}));

// --- 3. DATABASE CONNECTION ---

const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  logger.info('MongoDB database connection established successfully!');
});

// --- 4. API ROUTES ---

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const subcategoriesRouter = require('./routes/subcategories');
const uploadRouter = require('./routes/upload');

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter);
app.use('/upload', uploadRouter);

// --- 5. START SERVER ---

app.listen(PORT, () => {
  logger.info(`Server starting on port ${PORT}`);
});
