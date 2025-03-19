const { databaseTransaction } = require('./db');

async function selectProducts() {
  const sql =
    'SELECT product_id as id, description, price, unity, stock, cost FROM product ORDER BY product_id';

  const result = await databaseTransaction(sql);

  return result;
}

async function selectProduct(id) {
  const sql =
    'SELECT product_id as id, description, price, unity, stock, cost FROM product WHERE product_id = $1';

  const result = await databaseTransaction(sql, [id]);

  return result;
}

async function insertProduct(body) {
  const sql =
    'INSERT INTO product (description, price, unity, stock, cost) VALUES ($1, $2, $3, $4, $5)';

  const args = [
    body.description,
    body.price,
    body.unity,
    body.stock,
    body.cost,
  ];

  databaseTransaction(sql, args);

  return;
}

async function updateProduct(body) {
  const sql =
    'UPDATE product SET description = $1, cost = $2, price = $3, unity = $4, stock = $5 WHERE product_id = $6';

  const args = [
    body.description,
    body.cost,
    body.price,
    body.unity,
    body.stock,
    body.id,
  ];

  databaseTransaction(sql, args);

  return;
}

async function deleteProduct(id) {
  const sql = 'DELETE FROM product WHERE product_id = $1';

  databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectProducts,
  selectProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
};
