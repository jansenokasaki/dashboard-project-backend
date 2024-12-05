// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });

// Definir o esquema e modelo do produto
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

// Rota para listar todos os produtos (GET)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
});

// Rota para adicionar um novo produto (POST)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const newProduct = new Product({ name, price, quantity });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao adicionar produto', error });
  }
});

// Rota para atualizar um produto (PUT)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto', error });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID Recebido:', id); // Log do ID para depuração
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar produto', error });
  }
});

// Rota para excluir um produto (DELETE)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Erro ao excluir produto', error });
  }
});

// Rota para buscar o clima
app.get('/api/weather', async (req, res) => {
  const city = 'Recife';
  const weatherApiKey = process.env.OPENWEATHER_API_KEY;
  console.log(weatherApiKey);

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clima', error: error.message });
  }
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
