const { databaseTransaction } = require('./db');

async function selectOrders() {
  const sql = `SELECT o.order_id, o.client_id, c.name as client_name, o.delivery_date, o.observation, o.paid 
    FROM orders o
    LEFT JOIN client c on c.client_id = o.client_id
    `;

  const result = await databaseTransaction(sql);

  const orders = [];

  for (let i = 0; i < result.length; i++) {
    const order = result[i];

    const orderSql =
      'SELECT order_item_order, product_id, quantity, observation FROM order_item WHERE order_id = $1';

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
  let sql = `SELECT o.order_id, o.client_id, c.name as client_name, o.delivery_date, o.observation, o.paid 
    FROM orders o
    LEFT JOIN client c on c.client_id = o.client_id
    WHERE o.order_id = $1`;

  let result = await databaseTransaction(sql, [id]);

  let obj = result[0];

  sql =
    'SELECT order_item_order, product_id, quantity, price, observation FROM order_item WHERE order_id = $1';

  itens = await databaseTransaction(sql, [id]);

  obj = {
    ...obj,
    itens,
  };

  return obj;
}

async function insertOrder(body) {
  let sql =
    'INSERT INTO orders (client_id, delivery_date, observation, paid) VALUES ($1, $2, $3, $4)';

  let args = [body.client_id, body.delivery_date, body.observation, body.paid];

  await databaseTransaction(sql, args);

  const order_id = await databaseTransaction(
    'SELECT MAX(order_id) FROM orders'
  );
  console.log(order_id[0]);
  for (let i = 0; i < body.itens.length; i++) {
    sql =
      'INSERT INTO order_item (order_id, order_item_order, product_id, quantity, observation) VALUES ($1, $2, $3, $4, $5)';

    args = [
      order_id[0].max,
      body.itens[i].order_item_order,
      body.itens[i].product_id,
      body.itens[i].quantity,
      body.itens[i].observation,
    ];

    await databaseTransaction(sql, args);
  }

  return;
}

async function updateOrder(body) {
  let sql =
    'UPDATE orders SET client_id = $1, delivery_date = $2, observation = $3, paid = $4 WHERE order_id = $5';

  let args = [
    body.client_id,
    body.delivery_date,
    body.observation,
    body.paid,
    body.order_id,
  ];

  await databaseTransaction(sql, args);

  for (let i = 0; i < body.itens.length; i++) {
    sql =
      'UPDATE order_item SET order_item_order = $1, product_id = $2, quantity = $3, observation = $4 WHERE order_id = $5';

    args = [
      body.itens[i].order_item_order,
      body.itens[i].product_id,
      body.itens[i].quantity,
      body.itens[i].observation,
      body.order_id,
    ];

    await databaseTransaction(sql, args);
  }

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
