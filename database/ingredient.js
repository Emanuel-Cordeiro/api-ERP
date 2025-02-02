const { databaseTransaction } = require('./db');

async function selectIngredients() {
  const sql = 'SELECT * FROM ingredient';

  const result = await databaseTransaction(sql);

  return result;
}

async function selectIngredient(id) {
  const sql = 'SELECT * FROM ingredient WHERE ingredient_id = $1';

  const result = await databaseTransaction(sql, [id]);

  return result;
}

async function insertIngredient(ingredient) {
  const sql =
    'INSERT INTO ingredient (description, unity, cost, stock) VALUES ($1, $2, $3, $4)';

  const args = [
    ingredient[0].description,
    ingredient[0].unity,
    ingredient[0].cost,
    ingredient[0].stock,
  ];

  await databaseTransaction(sql, args);

  return;
}

async function updateIngredient(ingredient) {
  const sql =
    'UPDATE ingredient SET description = $1, unity = $2, cost = $3, stock = $4 WHERE ingredient_id = $5';

  const args = [
    ingredient[0].description,
    ingredient[0].unity,
    ingredient[0].cost,
    ingredient[0].stock,
    ingredient[0].ingredient_id,
  ];

  await databaseTransaction(sql, args);

  return;
}

async function deleteIngredient(id) {
  const sql = 'DELETE FROM ingredient WHERE ingredient_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectIngredient,
  selectIngredients,
  insertIngredient,
  updateIngredient,
  deleteIngredient,
};
