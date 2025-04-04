const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./db"); // Use promise-based MySQL connection

const app = express();
console.log("Server is starting...");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
console.log("Middleware setup complete...");

// --- API Endpoints ---

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Pizzariya API!");
});

// 1. Get Outlets by City
app.get("/outlets/:city", async (req, res) => {
  const city = req.params.city;
  try {
    const [result] = await db.execute("SELECT * FROM outlets WHERE city = ?", [city]);
    res.json(result);
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Food Items (with optional filters)
app.get("/food-items", async (req, res) => {
  const { category, region } = req.query;
  let sql = "SELECT * FROM food_items WHERE 1=1";
  const params = [];

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (region) {
    sql += " AND region = ?";
    params.push(region);
  }

  try {
    const [result] = await db.execute(sql, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Place an Order
app.post("/order", async (req, res) => {
  try {
    const { user_id, outlet_id, total_price, items } = req.body;

    const [orderResult] = await db.execute(
      "INSERT INTO orders (user_id, outlet_id, total_price) VALUES (?, ?, ?)",
      [user_id, outlet_id, total_price]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)",
        [orderId, item.item_id, item.quantity, item.subtotal]
      );
    }

    res.json({ orderId, message: "Order placed!" });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. Submit a Review
app.post("/review", async (req, res) => {
  const { user_id, outlet_id, item_id, rating, comment } = req.body;
  try {
    await db.execute(
      "INSERT INTO reviews (user_id, outlet_id, item_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [user_id, outlet_id, item_id, rating, comment]
    );
    res.json({ message: "Review submitted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin Login
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [result] = await db.execute("SELECT * FROM admin WHERE email = ?", [email]);
    if (result.length === 0) {
      return res.status(400).json({ msg: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, result[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const token = jwt.sign({ admin_id: result[0].admin_id }, "secretkey", {
      expiresIn: "1h"
    });

    res.json({ token, user_id: result[0].admin_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Admin - Create Outlet
app.post("/admin/outlet", async (req, res) => {
  const { name, city, address } = req.body;
  try {
    await db.execute("INSERT INTO outlets (name, city, address) VALUES (?, ?, ?)", [
      name,
      city,
      address
    ]);
    res.json({ message: "Outlet added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Admin - Create Food Item
app.post("/admin/food-item", async (req, res) => {
  const { name, outlet_id, category, region, price, description } = req.body;
  try {
    await db.execute(
      "INSERT INTO food_items (name, outlet_id, category, region, price, description) VALUES (?, ?, ?, ?, ?, ?)",
      [name, outlet_id, category, region, price, description]
    );
    res.json({ message: "Food item added!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin - Update Order Status
app.put("/admin/update-order/:order_id", async (req, res) => {
  const { delivery_status, delivery_boy_name } = req.body;
  try {
    await db.execute(
      "UPDATE orders SET delivery_status = ?, delivery_boy_name = ? WHERE order_id = ?",
      [delivery_status, delivery_boy_name, req.params.order_id]
    );

    io.emit("orderUpdate", {
      order_id: req.params.order_id,
      delivery_status
    });

    res.json({ message: "Order updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Get Order Status
app.get("/order-status/:order_id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "SELECT delivery_status, delivery_boy_name FROM orders WHERE order_id = ?",
      [req.params.order_id]
    );
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start Server and WebSocket ---
const server = app.listen(5000, () => {
  console.log("Server started on port 5000");
});

const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
