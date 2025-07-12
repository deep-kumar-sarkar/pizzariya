export default (db) => {
    const create = async (userId, menuItemId, outletId, rating, comment) => {
      const [result] = await db.execute(
        'INSERT INTO reviews (user_id, menu_item_id, outlet_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?, NOW())',
        [userId, menuItemId, outletId, rating, comment]
      );
      return result.insertId;
    };
  
    const findByItemOutlet = async (menuItemId, outletId) => {
      const [rows] = await db.execute(
        'SELECT * FROM reviews WHERE menu_item_id = ? AND outlet_id = ? ORDER BY review_date DESC',
        [menuItemId, outletId]
      );
      return rows;
    };
  
    const getAverage = async (menuItemId, outletId) => {
      const [rows] = await db.execute(
        'SELECT AVG(rating) AS averageRating, COUNT(*) AS reviewCount FROM reviews WHERE menu_item_id = ? AND outlet_id = ?',
        [menuItemId, outletId]
      );
      return rows[0];
    };
  
    return { create, findByItemOutlet, getAverage };
  };