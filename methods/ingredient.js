const express = require('express');

const db = require('../database/ingredient');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const ingredients = await db.selectIngredient(req.params.id);

    res.status(200).json(ingredients);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Erro ao buscar o ingrediente. Erro: ' + error });
  }
});

router.get('/', async (_, res) => {
  try {
    const ingredients = await db.selectIngredients();

    res.status(200).json(ingredients);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Erro ao buscar os ingredientes. Erro: ' + error });
  }
});

router.post('/', async (req, res) => {
  try {
    let status = 200;
    let ingredientId;

    if (!!req.body.ingredient_id) {
      ingredientId = await db.updateIngredient(req.body);
    } else {
      ingredientId = await db.insertIngredient(req.body);
    }

    res.status(status).json({ retorno: 'Sucesso', id: ingredientId });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: 'Erro ao inserir/alterar o ingrediente. Erro: ' + error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteIngredient(req.params.id);

    res.sendStatus(204);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Erro ao excluir o ingrediente. Erro: ' + error });
  }
});

module.exports = router;
