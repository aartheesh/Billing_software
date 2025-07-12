const db = require("./database");

function getAllProducts() {
  return db.prepare("SELECT * FROM products").all();
}

function addProduct(product) {
  const stmt = db.prepare(`
    INSERT INTO products (id, name, hsnCode, price, stock, gstRate)
    VALUES (@id, @name, @hsnCode, @price, @stock, @gstRate)
  `);
  stmt.run(product);
}

function deleteProduct(id) {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

function reduceStock(id, quantity) {
  const product = db.prepare("SELECT stock FROM products WHERE id = ?").get(id);
  if (!product) {
    throw new Error("Product not found");
  }
  console.log("Current stock:", product.stock, "Requested quantity:", quantity);
  console.log("Reducing stock for product ID:", id);
  if (product && product.stock >= quantity) {
    db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(quantity, id);
  } else {
    throw new Error("Insufficient stock");
  }
}

module.exports = { getAllProducts, addProduct, deleteProduct,reduceStock };
