import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, addToCart, deleteFromCart, getProductFromCart } from '../api/Api';
import { AuthContext } from '../context/AuthProvider';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);
  
    useEffect(() => {
      const checkProductInCart = async () => {
        if (product?._id) {
          const result = await getProductFromCart(product._id, user.id);
          setIsInCart(result?._id ? true : false);
          setQuantity(result?.count ? result.count : 1);
        }
      };
  
      checkProductInCart();
    }, [product?._id, user?.id]);
  
    const handleAddToCart = (event) => {
      event.stopPropagation();
      setIsInCart(true);
      product.count = quantity;
      addToCart(product, user.id);
    };
  
    const handleIncreaseQuantity = (event) => {
      event.stopPropagation();
      if (quantity + 1 <= product.stock) {
        product.count = quantity + 1;
        addToCart(product, user.id);
        setQuantity(quantity + 1);
      }
    };
  
    const handleDecreaseQuantity = (event) => {
      event.stopPropagation();
      if (quantity > 1) {
        product.count = quantity - 1;
        addToCart(product, user.id);
        setQuantity(quantity - 1);
      }
    };
  
    const handleRemoveFromCart = (event) => {
      event.stopPropagation();
      setIsInCart(false);
      deleteFromCart(user.id, product._id);
    };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-details">
      <img src="/images/image.png" alt={product.name} />
      <div className="product-info">
        <h2>{product.name}</h2>
        <p><strong>Description:</strong> {product.description}</p>
        <p className="price"><strong>Price:</strong> ${product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Stock:</strong> {product.stock} units available</p>
        {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
        {product.createdAt && (
          <p>
            <strong>Added on:</strong> {formatDate(product.createdAt)}
          </p>
        )}
        {!isInCart ? (
        <button onClick={handleAddToCart} className="product-details-button add-btn">
          Add to Cart
        </button>
      ) : (
        <div className="cart-controls1">
          <button onClick={handleDecreaseQuantity} className="count-btn">-</button>
          <span className="count">{quantity}</span>
          <button onClick={handleIncreaseQuantity} className="count-btn">+</button>
          <button onClick={handleRemoveFromCart} className="remove-btn">Remove</button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductDetails;
