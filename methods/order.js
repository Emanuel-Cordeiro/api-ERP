const express = require('express');

const db = require('../database/order');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const response = await db.selectOrder(req.params.id);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o pedido. Erro: ' + error });
  }
});

router.get('/', async (_, res) => {
  try {
    const response = await db.selectOrders();

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os pedido. Erro: ' + error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!!req.body[0].order_id) {
      await db.updateOrder(req.body);
    } else {
      await db.insertOrder(req.body);
    }

    res.sendStatus(201);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao inserir/alterar o pedido. Erro: ' + error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteOrder(req.params.id);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o pedido. Erro: ' + error });
  }
});

module.exports = router;
