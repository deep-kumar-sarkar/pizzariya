import db from '../config/db.config.js';

export const getOutletsByCity = async (req, res) => {
  try {
    const { city } = req.query;
    const [rows] = await db.execute(
      'SELECT id, name, address, phone FROM outlets WHERE city = ?',
      [city]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch outlets' });
  }
};
