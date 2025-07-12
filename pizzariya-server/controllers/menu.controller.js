import db from '../config/db.config.js';

export const getMenuByOutlet = async (req, res) => {
  try {
    const { outlet_id } = req.query;
    const [rows] = await db.execute(
      'SELECT id, name, description, price, is_vegetarian, cuisine_type FROM menu_items WHERE outlet_id = ?',
      [outlet_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};
