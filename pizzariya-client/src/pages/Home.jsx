
import "./Home.css";
import pizzaImage from "./Home.png";

const Home = () => {


  return (
    <div className="home-container">
      <header className="hero-section">
        <h3>Welcome to PIZZARIYA</h3>
        <p>India's most trusted and delicious pizza brand, now online!</p>
      </header>

      

      <section className="about-section">
      <img
         src={pizzaImage}
         alt="Pizza"
         style={{ width: "70%", height: "300px", display: "block", margin: "0 auto" }}
      />


        <div>
          <h2>Who We Are?</h2>
          <p >
          PIZZARIYA is India's go-to destination for fresh, mouth-watering pizzas delivered straight from our local outlets to your doorstep. Whether you're craving the timeless charm of a classic Margherita or the bold punch of spicy Indian-inspired toppings, we serve it hot, fast, and unforgettable. With a growing footprint across Indian cities, PIZZARIYA brings a slice of joy to every neighborhood we serve.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
