const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const txRoutes = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/finbridge';

mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err=> console.error('MongoDB connection error:', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', txRoutes);

app.get('/', (req,res)=> res.send({ status: 'FinBridge API' }));

app.listen(PORT, ()=> console.log('Server running on port', PORT));
