export default (db) => {
    const create = async (name, email, hashedPassword) => {
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      return result.insertId;
    };
  
    const findByEmail = async (email) => {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      console.log('User found:', rows[0]);

      return rows[0];
    };
  
    return { create, findByEmail };
  };