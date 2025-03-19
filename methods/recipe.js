const express = require('express');

const db = require('../database/recipe');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const cliente = await db.selectRecipe(req.params.id);

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a receita. Erro: ' + error });
  }
});

router.get('/', async (_, res) => {
  try {
    const clientes = await db.selectRecipes();

    res.json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao buscar as receitas. Erro: ' + error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!!req.body.id) {
      await db.updateRecipe(req.body);
    } else {
      await db.insertRecipe(req.body);
    }

    res.sendStatus(201);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao incluir/alterar a receita. Erro: ' + error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteRecipe(req.params.id);

    res.sendStatus(201);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao excluir a receita. Erro: ' + error });
  }
});

module.exports = router;
