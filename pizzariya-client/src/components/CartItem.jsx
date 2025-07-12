import "./CartItem.css";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <div>
        <h4>{item.name}</h4>
        <p>₹ {item.price}</p>
      </div>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
};

export default CartItem;
