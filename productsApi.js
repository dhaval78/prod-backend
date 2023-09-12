const express = require('express');
const app = express();
const cors=require('cors');
const { productsData } = require('./productsData');
app.use(express.json());
app.use(cors());
app.use(function(req,res,next){
res.header("Access-Control-Allow-Origin")
res.header("Access-Control-Methods",
"GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
)
res.header("Access-Control-Allow-Headers",
"Origin,X-Requested-With,Content-Type,Accept"
)
next();
});

app.get('/products', (req, res) => {
    let filteredProducts = [...productsData];
  
    const category = req.query.category;
    const maxPrice = parseFloat(req.query.maxprice);
    const maxQuantity = parseInt(req.query.maxqty);
    const minQuantity = parseInt(req.query.minqty);
  
    if (category) {
      filteredProducts = filteredProducts.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
  
    if (!isNaN(maxPrice)) {
      filteredProducts = filteredProducts.filter(item => item.price <= maxPrice);
    }
  
    if (!isNaN(maxQuantity)) {
      filteredProducts = filteredProducts.filter(item => item.quantity <= maxQuantity);
    }
  
    if (!isNaN(minQuantity)) {
      filteredProducts = filteredProducts.filter(item => item.quantity >= minQuantity);
    }
  
    if (filteredProducts.length > 0) {
      res.json(filteredProducts);
    } else {
      res.status(404).json({ message: 'No products found matching the criteria' });
    }
  });
  

app.get('/products/:id', (req, res) => {
  const prodid = +req.params.id;
  const product = productsData.find(item => item.id === prodid);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


app.get('/products/category/:catname', (req, res) => {
  const categoryName = req.params.catname;
  const productsInCategory = productsData.filter(item => item.category.toLowerCase() === categoryName.toLowerCase());
  
  if (productsInCategory.length > 0) {
    res.json(productsInCategory);
  } else {
    res.status(404).json({ message: 'No products found in the specified category' });
  }
});


app.get('/products/order/:field', (req, res) => {
  const field = req.params.field.toLowerCase();
  let sortedProducts;

  switch (field) {
    case 'price':
      sortedProducts = productsData.slice().sort((a, b) => a.price - b.price);
      break;
    case 'quantity':
      sortedProducts = productsData.slice().sort((a, b) => a.quantity - b.quantity);
      break;
    case 'value':
      sortedProducts = productsData.slice().sort((a, b) => (a.price * a.quantity) - (b.price * b.quantity));
      break;
    default:
      return res.status(400).json({ message: 'Invalid sorting field' });
  }

  res.json(sortedProducts);
});

app.post('/products', (req, res) => {
  try {
    let newProduct = req.body;
    const isDuplicate = productsData.find(product => product.id == newProduct.id);
    if (isDuplicate) {
      throw new Error('Product already exists');
    }
    console.log(newProduct);
    productsData.push(newProduct);
    res.json(newProduct);
  } catch (error) {
   
    res.status(400).json({ error: error.message });
  }
});


app.put('/products/:id', (req, res) => {
  const prodid = +req.params.id;
  const updatedProduct = req.body;

  const index = productsData.findIndex(item => item.id === Number(prodid));

  if (index !== -1) {
    productsData[index] = updatedProduct;
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


app.delete('/products/:id', (req, res) => {
  const prodid = +req.params.id;

  const index = productsData.findIndex(item => item.id=== Number(prodid));

  if (index !== -1) {
    const deletedProduct = productsData.splice(index, 1);
    res.json(deletedProduct[0]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


const port = 2410;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
