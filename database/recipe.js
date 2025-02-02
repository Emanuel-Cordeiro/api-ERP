const { databaseTransaction } = require('./db');

async function selectRecipes() {
  const sql = 'SELECT recipe_id, description, cost FROM recipe';

  const result = await databaseTransaction(sql);

  const recipes = [];

  for (let i = 0; i < result.length; i++) {
    const recipe = result[i];

    const ingredientSql =
      'SELECT ingredient_id, quantity FROM recipe_ingredient WHERE recipe_id = $1';

    const ingredients = await databaseTransaction(ingredientSql, [
      recipe.recipe_id,
    ]);

    const obj = {
      ...recipe,
      ingredients,
    };

    recipes.push(obj);
  }

  return recipes;
}

async function selectRecipe(id) {
  let sql =
    'SELECT recipe_id, description, cost FROM recipe WHERE recipe_id = $1';

  let result = await databaseTransaction(sql, [id]);

  let obj = result[0];

  sql =
    'SELECT ingredient_id, quantity FROM recipe_ingredient WHERE recipe_id = $1';

  result = await databaseTransaction(sql, [id]);

  obj = [
    {
      ...obj,
      itens: result,
    },
  ];

  return obj;
}

async function insertRecipe(body) {
  let sql = 'INSERT INTO recipe (description, cost) VALUES ($1, $2)';

  let args = [body[0].description, body[0].cost];

  await databaseTransaction(sql, args);

  const recipe_id = await databaseTransaction(
    'SELECT MAX(recipe_id) FROM recipe'
  );

  for (let i = 0; i < body[0].itens.length; i++) {
    sql =
      'INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)';

    args = [
      recipe_id[0].max,
      body[0].itens[i].ingredient_id,
      body[0].itens[i].quantity,
    ];

    await databaseTransaction(sql, args);
  }

  return;
}

async function updateRecipe(body) {
  let sql =
    'UPDATE recipe SET description = $1, cost = $2 WHERE recipe_id = $3';

  let args = [body[0].description, body[0].cost, body[0].recipe_id];

  for (let i = 0; i < body[0].itens.length; i++) {
    sql =
      'UPDATE recipe_ingredient SET ingredient_id = $1, quantity = $2 WHERE recipe_id = $3';

    args = [
      body[0].itens[i].ingredient_id,
      body[0].itens[i].quantity,
      body[0].recipe_id,
    ];

    await databaseTransaction(sql, args);
  }

  await databaseTransaction(sql, args);

  return;
}

async function deleteRecipe(id) {
  let sql = 'DELETE FROM recipe WHERE recipe_id = $1';

  await databaseTransaction(sql, [id]);

  sql = 'DELETE FROM recipe_ingredient WHERE recipe_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectRecipes,
  selectRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
};
