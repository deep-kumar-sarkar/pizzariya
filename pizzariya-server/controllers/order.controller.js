// import db from '../config/db.config.js';

// export const getPurchasedItems = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     // Join orders → order_items → menu_items to fetch item & outlet info
//     const [rows] = await db.execute(
//       `SELECT oi.menu_item_id,
//               mi.name,
//               mi.price,
//               mi.is_vegetarian,
//               mi.cuisine_type,
//               oi.outlet_id
//          FROM orders o
//    INNER JOIN order_items oi ON o.id = oi.order_id
//    INNER JOIN menu_items mi  ON oi.menu_item_id = mi.id
//         WHERE o.user_id = ?
//      ORDER BY o.ordered_at DESC`,
//       [userId]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch purchased items' });
//   }
// };

// export const createOrder = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const { itemsByOutlet } = req.body;
//       // itemsByOutlet: { outletId: [ { menu_item_id, price, quantity }, ... ], ... }

//       // Start transaction
//       const conn = await db.getConnection();
//       await conn.beginTransaction();

//       // Create one order per outlet
//       for (const [outletId, items] of Object.entries(itemsByOutlet)) {
//         // Calculate total for this outlet
//         const total = items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);

//         // Insert into orders
//         const [orderRes] = await conn.execute(
//           `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`,
//           [userId, total]
//         );
//         const orderId = orderRes.insertId;

//         // Insert order_items
//         for (const it of items) {
//           await conn.execute(
//             `INSERT INTO order_items (order_id, menu_item_id, outlet_id, quantity, price)
//              VALUES (?, ?, ?, ?, ?)`,
//             [orderId, it.menu_item_id, outletId, it.quantity || 1, it.price]
//           );
//         }
//       }

//       await conn.commit();
//       conn.release();

//       res.status(201).json({ message: "Order placed successfully" });
//     } catch (err) {
//       console.error(err);
//       if (conn) {
//         await conn.rollback();
//         conn.release();
//       }
//       res.status(500).json({ message: "Failed to place order" });
//     }
//   };

// controllers/order.controller.js
import db from "../config/db.config.js";

// Used in router.get('/purchased')
export const getPurchasedItemsByUser = async (userId) => {
  const query = `
    SELECT o.id AS order_id, oi.menu_item_id, mi.name, mi.price, oi.quantity, o.user_id
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE o.user_id = ?
  `;
  const [rows] = await db.execute(query, [userId]);
  return rows;
};

// Used in router.post('/')
export const createMany = async (userId, itemsByOutlet) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const createdOrders = [];

    for (const [outletId, items] of Object.entries(itemsByOutlet)) {
      const total = items.reduce(
        (sum, i) => sum + i.price * (i.quantity || 1),
        0
      );

      const [orderRes] = await conn.execute(
        `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`,
        [userId, total]
      );
      const orderId = orderRes.insertId;

      for (const it of items) {
        await conn.execute(
          `INSERT INTO order_items (order_id, menu_item_id, outlet_id, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, it.menu_item_id, outletId, it.quantity || 1, it.price]
        );
      }

      createdOrders.push({ outletId, orderId });
    }

    await conn.commit();
    conn.release();

    return createdOrders;
  } catch (err) {
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    throw err;
  }
};

const OrderModel = {
  async getPurchasedItemsByUser(userId) {
    const query = `
      SELECT o.id AS order_id, oi.menu_item_id, mi.name, mi.price, oi.quantity
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.user_id = ?
    `;
    const [rows] = await db.execute(query, [userId]);
    console.log("Database query result:", rows); // Debug log
    return rows;
  },
};
