import React, { useContext, useEffect, useState } from 'react';
import '../styles/ProductCard.css';
import { Link } from 'react-router-dom';
import { addToCart, deleteFromCart, getProductFromCart } from '../api/Api';
import { AuthContext } from '../context/AuthProvider';

const ProductCard = ({ product }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkProductInCart = async () => {
      if (product._id) {
        const result = await getProductFromCart(product._id, user?.id);
        setIsInCart(result?._id ? true : false);
        setQuantity(result?.count ? result.count : 1);
      }
    };

    checkProductInCart();
  }, [product._id, user?.id]);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    setIsInCart(true);
    product.count = quantity;
    addToCart(product, user?.id);
  };

  const handleIncreaseQuantity = (event) => {
    event.stopPropagation();
    if (quantity + 1 <= product.stock) {
      product.count = quantity + 1;
      addToCart(product, user?.id);
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = (event) => {
    event.stopPropagation();
    if (quantity > 1) {
      product.count = quantity - 1;
      addToCart(product, user?.id);
      setQuantity(quantity - 1);
    }
  };

  const handleRemoveFromCart = (event) => {
    event.stopPropagation();
    setIsInCart(false);
    deleteFromCart(user?.id, product._id);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img src="/images/image.png" alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <p>${product.price}</p>

      {!isInCart ? (
        <button onClick={handleAddToCart} className="product-card-button add-btn">
          Add to Cart
        </button>
      ) : (
        <div className="cart-controls">
          <button onClick={handleDecreaseQuantity} className="count-btn">-</button>
          <span className="count">{quantity}</span>
          <button onClick={handleIncreaseQuantity} className="count-btn">+</button>
          <button onClick={handleRemoveFromCart} className="remove-btn">Remove</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
