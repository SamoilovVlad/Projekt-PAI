import React, { useState, useEffect, useContext } from 'react';
import { getCart, addToCart, deleteFromCart } from '../api/Api';
import { getProductFromCart } from '../api/Api';
import '../styles/Cart.css';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [isProductChanged, setIsProductChanged] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart(user?.id) || { cartItems: [] };
        const products = await Promise.all(data?.cartItems?.map(async (product) => await getProductFromCart(product?._id, user?.id)));
        
        console.log(products);
        setCartItems(products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user?.id, isProductChanged]);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const handleIncreaseQuantity = (product, quantity) => {
        if(quantity + 1 <= product.stock){
          product.count = quantity + 1;
          addToCart(product, user.id);
          setIsProductChanged(!isProductChanged);
        }
      };
    
      const handleDecreaseQuantity = (product, quantity) => {
        if (quantity > 1) {
          product.count = quantity - 1;
          addToCart(product, user.id);
          setIsProductChanged(!isProductChanged);
        }
      };
    
      const handleRemoveFromCart = (product) => {
        deleteFromCart(user.id, product._id);
        setCartItems((prevCartItems) => prevCartItems.filter(item => item._id !==  product._id));
      };

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cartItems?.map((item) => (
          <div key={item?.id} className="cart-item">
            <Link style={{ textDecoration: "none", color: "inherit" }} to={`/product/${item._id}`}>
            <img src="/images/image.png" alt={item?.name} />
            </Link>
            <div className="item-details">
              <Link style={{ textDecoration: "none", color: "inherit" }}  to={`/product/${item._id}`}>
                <h3>{item?.name}</h3>
                <p>${item?.price}</p>
              </Link>
              <div className="cart-controls1">
                <button onClick={() => {handleDecreaseQuantity(item, item.count)}} className="count-btn">-</button>
                <span className="count">{item?.count}</span>
                <button onClick={() => {handleIncreaseQuantity(item, item.count)}} className="count-btn">+</button>
                <button onClick={() => {handleRemoveFromCart(item)}} className="remove-btn">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Summary</h3>
        <p>Total: ${cartItems?.reduce((acc, item) => acc + item?.price * item?.count, 0).toFixed(2)}</p>
        <Link to={"/checkout"}>
          <button>Proceed to Checkout</button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
