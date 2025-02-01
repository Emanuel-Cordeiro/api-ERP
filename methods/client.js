const express = require('express');

const db = require('../database/client'); 

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const cliente = await db.selectCustomer(req.params.id);

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o cliente. Erro: ' + error });
  }
});

router.get('/', async (_, res) => {
  try {
    const clientes = await db.selectCustomers();

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes. Erro: ' + error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!!req.body.client_id) {
      await db.updateCustomer(req.body)
    } else {
      await db.insertCustomer(req.body);
    }

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao incluir/alterar o cliente. Erro: ' + error });
  }
});

router.delete('/:id', async (req,res) => {
  try {
    await db.deleteCustomer(req.params.id)

    res.sendStatus(201)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o cliente. Erro: ' + error });
  }
});

module.exports = router;