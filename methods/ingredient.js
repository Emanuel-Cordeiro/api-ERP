const express = require('express');

const db = require('../database/ingredient')

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const cliente = await db.selectIngredient(req.params.id);

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o ingrediente. Erro: ' + error });
  }
});
 
router.get('/', async (_, res) => {
  try {
    const clientes = await db.selectIngredients();

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os ingredientes. Erro: ' + error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!!req.body[0].ingredient_id) {
      await db.updateIngredient(req.body)
    } else {
      await db.insertIngredient(req.body);
    }

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao inserir/alterar o ingrediente. Erro: ' + error });
  }
});

router.delete('/:id', async (req,res) => {
  try {
    await db.deleteIngredient(req.params.id)

    res.sendStatus(201)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o ingrediente. Erro: ' + error });
  }
});

module.exports = router;