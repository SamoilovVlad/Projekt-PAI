import React, { useState } from 'react';
import { addProduct } from '../api/Api';
import '../styles/AddNewProduct.css';

const AddNewProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    brand: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(formData);
      setMessage('Product added successfully!');
      setFormData({ name: '', price: '', image: '', description: '', category: '', stock: '' });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddNewProduct;
