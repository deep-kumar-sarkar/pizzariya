import { useState, useEffect, useContext } from "react";
import OutletList from "../components/OutletList";
import FoodItemCard from "../components/FoodItemCard";
import { CartContext } from "../context/CartContext";
import API_BASE_URL from "../config/api";
import "./Menu.css";

const Menu = () => {
  const [city, setCity] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("");
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    addToCart(selectedOutlet, item);
  };

  // Fetch outlets when user searches by city
  const handleCitySearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }
    setError("");
    setSelectedOutlet(null);
    setMenuItems([]);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/outlets?city=${encodeURIComponent(city)}`
      );
      if (!res.ok) throw new Error("Failed to fetch outlets");
      const data = await res.json();
      setOutlets(data);
    } catch (err) {
      setError(err.message);
      setOutlets([]);
    }
  };

  // Fetch menu items whenever an outlet is selected
  useEffect(() => {
    if (!selectedOutlet) return;
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/menu?outlet_id=${selectedOutlet.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, [selectedOutlet]);

  // Apply filters
  const filteredItems = menuItems.filter(
    (item) =>
      (!filterType ||
        (item.is_vegetarian ? "Veg" : "Non-Veg") === filterType) &&
      (!filterCuisine || item.cuisine_type === filterCuisine)
  );

  return (
    <div className="menu-page">
      <h2>Find Your Outlet</h2>
      <div className="search-bar">
        <input
          type="text"
          value={city}
          placeholder="Enter city name"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleCitySearch}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}

      {outlets.length > 0 && (
        <>
          <h3>Available Outlets in {city}</h3>
          <OutletList outlets={outlets} onSelectOutlet={setSelectedOutlet} />
        </>
      )}

      {selectedOutlet && (
        <>
          <h3>Menu for {selectedOutlet.name}</h3>

          <div className="filters">
            <label>
              Type:
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </label>

            <label>
              Cuisine:
              <select
                value={filterCuisine}
                onChange={(e) => setFilterCuisine(e.target.value)}
              >
                <option value="">All</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
              </select>
            </label>
          </div>

          <div className="item-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={{
                    ...item,
                    outletId: selectedOutlet.id, // ⬅️ This is the critical addition
                    type: item.is_vegetarian ? "Veg" : "Non-Veg",
                    cuisine: item.cuisine_type,
                  }}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="no-items">No items match your filters.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
