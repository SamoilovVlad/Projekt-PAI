import React, { useState } from 'react';
import '../styles/Checkout.css';

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    notes: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { fullName, email, address } = formData;

    if (!fullName || !email || !address) {
      setError('Please fill in all required fields.');
      return;
    }

    setShowMessage(true);
    setError('');
  };

  return (
    <div className="checkout-page">
      <h2 style={{ marginLeft: '20px' }}>Checkout</h2>
      <div style={{ paddingTop: 0 }} className="checkout-form">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Shipping Address" value={formData.address} onChange={handleChange} />
        <textarea name="notes" placeholder="Notes (optional)" rows="4" value={formData.notes} onChange={handleChange}></textarea>
        
        {error && <p className="error-message">{error}</p>}
        
        <button onClick={handleSubmit}>Place Order</button>
        {showMessage && <p className="message">Order accepted!</p>}
      </div>
    </div>
  );
};

export default Checkout;
