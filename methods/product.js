const express = require('express');

const db = require('../database/product');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const cliente = await db.selectProduct(req.params.id);

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o produto. Erro: ' + error });
  }
});

router.get('/', async (_, res) => {
  try {
    const clientes = await db.selectProducts();

    res.json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao buscar os produtos. Erro: ' + error });
  }
});

router.post('/', async (req, res) => {
  try {
    let status = 200;
    let productId;

    if (!!req.body.id) {
      productId = await db.updateProduct(req.body);
    } else {
      productId = await db.insertProduct(req.body);

      status = 201;
    }

    res.status(status).json({ retorno: 'Sucesso', id: productId });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao inserir/alterar o produto. Erro: ' + error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteProduct(req.params.id);

    res.sendStatus(201);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao excluir o produto. Erro: ' + error });
  }
});

module.exports = router;
