const { databaseTransaction } = require('./db');

async function selectOrders() {
  const sql = 'SELECT order_id, client_id, delivery_date, observation, paid FROM orders';

  const result = await databaseTransaction(sql);

  const orders = [];

  for (let i = 0; i < result.length; i++) {
    const order = result[i];

    const orderSql = 'SELECT order_item_order, product_id, quantity, observation FROM order_item WHERE order_id = $1';

    const itens = await databaseTransaction(orderSql, [order.order_id]);
 
    const obj = {
      ...order,
      itens,
    };

    orders.push(obj);
  }

  return orders;
}

async function selectOrder(id) {
  let sql = 'SELECT order_id, client_id, delivery_date, observation, paid FROM orders WHERE order_id = $1';
  
  let result = await databaseTransaction(sql, [id]);
  
  let obj = result[0];

  sql = 'SELECT order_item_order, product_id, quantity, observation FROM order_item WHERE order_id = $1';

  itens = await databaseTransaction(sql, [id]);

  obj = [{
    ...obj,
    itens
  }]

  return obj;
}

async function insertOrder(body) {
  let sql =  'INSERT INTO orders (client_id, delivery_date, observation, paid) VALUES ($1, $2, $3, $4)';

  let args = [
    body[0].client_id,
    body[0].delivery_date,
    body[0].observation,
    body[0].paid
  ];

  databaseTransaction(sql, args);

  const order_id = await databaseTransaction('SELECT MAX(order_id) FROM orders');

  for (let i = 0; i < body[0].itens.length; i++) {
    sql = 'INSERT INTO order_item (order_id, order_item_order, product_id, quantity, observation) VALUES ($1, $2, $3, $4, $5)';

    args = [
      order_id[0].max,
      body[0].itens[i].order_item_order,
      body[0].itens[i].product_id,
      body[0].itens[i].quantity,
      body[0].itens[i].observation,
    ];

    await databaseTransaction(sql, args);
  };

  return;
}

async function updateOrder(body) {
  let sql = 'UPDATE orders SET client_id = $1, delivery_date = $2, observation = $3, paid = $4 WHERE order_id = $5';
  
  let args = [
    body[0].client_id,
    body[0].delivery_date,
    body[0].observation,
    body[0].paid,
    body[0].order_id
  ];

  await databaseTransaction(sql, args);

  for (let i = 0; i < body[0].itens.length; i++) {
    sql = 'UPDATE order_item SET order_item_order = $1, product_id = $2, quantity = $3, observation = $4 WHERE order_id = $5';

    args = [
      body[0].itens[i].order_item_order,
      body[0].itens[i].product_id,
      body[0].itens[i].quantity,
      body[0].itens[i].observation,
      body[0].order_id,
    ];

    await databaseTransaction(sql, args);
  };

  return;
}

async function deleteOrder(id) {
  let sql = 'DELETE FROM orders WHERE order_id = $1';

  await databaseTransaction(sql, [id]);

  sql = 'DELETE FROM order_item WHERE order_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectOrders,
  selectOrder,
  insertOrder,
  updateOrder,
  deleteOrder,
};