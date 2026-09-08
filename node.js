const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// إعداد بيانات الاتصال بـ MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '' // تأكد أن MySQL يعمل من XAMPP وأن كلمة المرور مطابقة
};

let pool;

async function initDB() {
  try {
    // 1. الاتصال المباشر بـ MySQL لإنشاء القاعدة
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS store_db`);
    await tempConnection.end();

    // 2. إنشاء Pool للربط بقاعدة البيانات store_db
    pool = mysql.createPool({
      ...dbConfig,
      database: 'store_db'
    });

    // 3. إنشاء الجداول
    await pool.query(`CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT AUTO_INCREMENT PRIMARY KEY,
      SupplierName VARCHAR(255),
      ContactNumber VARCHAR(255)
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS Products (
      ProductID INT AUTO_INCREMENT PRIMARY KEY,
      ProductName VARCHAR(255),
      Price DECIMAL(10, 2),
      StockQuantity INT,
      SupplierID INT,
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID) ON DELETE SET NULL
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT AUTO_INCREMENT PRIMARY KEY,
      ProductID INT,
      QuantitySold INT,
      SaleDate DATE,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
    )`);

    console.log('Database & Tables Initialized Successfully!');
  } catch (err) {
    console.error('FULL ERROR DETAILS:', err);
  }
}

// ----------------------------------------------------
// Middleware للتحقق من جاهزية الاتصال بقاعدة البيانات
// ----------------------------------------------------
app.use((req, res, next) => {
  if (!pool) {
    return res.status(500).send('Database connection is not ready yet');
  }
  next();
});

// ----------------------------------------------------
// 2. CRUD Operations - Products
// ----------------------------------------------------
app.post('/products', async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    await pool.query(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      [ProductName, Price, StockQuantity, SupplierID || null]
    );
    res.status(201).send('Product created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products WHERE ProductID = ?', [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity } = req.body;
    await pool.query(
      'UPDATE Products SET ProductName=?, Price=?, StockQuantity=? WHERE ProductID=?',
      [ProductName, Price, StockQuantity, req.params.id]
    );
    res.send('Product updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id]);
    res.send('Product deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ----------------------------------------------------
// 3. CRUD Operations - Suppliers
// ----------------------------------------------------
app.post('/suppliers', async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    await pool.query('INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)', [SupplierName, ContactNumber]);
    res.status(201).send('Supplier created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Suppliers');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/suppliers/:id', async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    await pool.query('UPDATE Suppliers SET SupplierName=?, ContactNumber=? WHERE SupplierID=?', [SupplierName, ContactNumber, req.params.id]);
    res.send('Supplier updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/suppliers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Suppliers WHERE SupplierID = ?', [req.params.id]);
    res.send('Supplier deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ----------------------------------------------------
// 4. Sales Management
// ----------------------------------------------------
app.post('/sales', async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;
    await pool.query('INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)', [ProductID, QuantitySold, SaleDate]);
    res.status(201).send('Sale recorded');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/sales', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/sales/product/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sales WHERE ProductID = ?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ----------------------------------------------------
// 5. Specific Tasks & Reports
// ----------------------------------------------------
app.put('/products/update-bread', async (req, res) => {
  try {
    await pool.query("UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'");
    res.send('Bread price updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/products/delete-eggs', async (req, res) => {
  try {
    await pool.query("DELETE FROM Products WHERE ProductName = 'Eggs'");
    res.send('Eggs deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/reports/total-sales-by-product', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ProductID, SUM(QuantitySold) AS TotalSold 
      FROM Sales 
      GROUP BY ProductID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/reports/highest-stock', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/reports/suppliers-f', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'");
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/reports/never-sold', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM Products 
      WHERE ProductID NOT IN (SELECT DISTINCT ProductID FROM Sales WHERE ProductID IS NOT NULL)
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/reports/detailed-sales', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT Products.ProductName, Sales.QuantitySold, Sales.SaleDate
      FROM Sales
      JOIN Products ON Sales.ProductID = Products.ProductID
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ----------------------------------------------------
// تشغيل السيرفر
// ----------------------------------------------------
const PORT = 3000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});