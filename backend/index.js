const express = require('express');
const redisClient = require('./redisClient');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopDB';
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

const JWT_SECRET = 'supersecretkey';

const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
];

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token, role: user.role, user });
});

app.post('/api/product', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const newProduct = new Product({ name, price, description, category, stock });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/product/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/cart', async (req, res) => {
  const { userId, product } = req.body;
  if (!userId || !product) {
    return res.status(400).json({ error: 'User ID and product are required' });
  }

  const cartKey = `cart:${userId}`;
  let cart = await redisClient.get(cartKey);
  cart = cart ? JSON.parse(cart) : { cartItems: [] };

  const existingProductIndex = cart.cartItems.findIndex(item => item._id === product._id);

  if (existingProductIndex !== -1) {
    cart.cartItems[existingProductIndex] = product;
  } else {
    cart.cartItems.push(product);
  }

  await redisClient.set(cartKey, JSON.stringify(cart));

  return res.json(cart);
});

app.delete('/cart', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ error: 'User ID and product ID are required' });
  }

  const cartKey = `cart:${userId}`;
  let cart = await redisClient.get(cartKey);
  cart = cart ? JSON.parse(cart) : { cartItems: [] };

  const updatedCartItems = cart.cartItems.filter(item => item._id !== productId);

  if (updatedCartItems.length === cart.cartItems.length) {
    return res.status(404).json({ error: 'Product not found in cart' });
  }

  cart.cartItems = updatedCartItems;

  await redisClient.set(cartKey, JSON.stringify(cart));

  return res.json(cart);
});

app.get('/cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const cartKey = `cart:${userId}`;
  const cart = await redisClient.get(cartKey);
  
  if (!cart) {
    return res.json({});
  }

  const cartItems = JSON.parse(cart).cartItems;
  const product = cartItems.find(item => item._id == productId);
  return res.json({product});
});


app.get('/cart', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const cartKey = `cart:${userId}`;
  const cart = await redisClient.get(cartKey);
  return res.json(cart ? JSON.parse(cart) : { cartItems: [] });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});