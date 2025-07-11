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
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- 2. SESSION MIDDLEWARE ---
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
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
const subcategoriesRouter = require('./routes/subcategories'); // <-- 1. IMPORT
const uploadRouter = require('./routes/upload');

app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter); // <-- 2. MOUNT
app.use('/upload', uploadRouter);

// --- 5. START SERVER ---
app.listen(PORT, () => {
  logger.info(`Server starting on port ${PORT}`);
});