import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { placeVendorOrder } from '../services/vendorAPI';
import orderAnimation from '../animations/Register.json';

const OrderForm = () => {
  const [formData, setFormData] = useState({ name: '', item: '', quantity: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     // await placeVendorOrder(formData);
      alert("Order placed successfully!");
      setFormData({ name: '', item: '', quantity: '' });
    } catch (err) {
      alert("Failed to place order");
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px', // reduced gap
        maxWidth: '900px',
        width: '100%'
      }}>
        {/* Left: Animation */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Lottie
            animationData={orderAnimation}
            loop={true}
            style={{ height: '350px', width: '100%' }}
          />
        </div>

        {/* Right: Form */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Place Your Order</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="item"
              placeholder="Product Name"
              value={formData.item}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default OrderForm;
