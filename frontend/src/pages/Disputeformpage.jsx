import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DisputeFormPage.css';

const DisputeFormPage = () => {
    const { userId, vendorId, productId, orderId } = useParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Incorrect number');
      return;
    } else {
      setPhoneError('');
    }

    const formData = {
      name,
      phone,
      address,
      message
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/disputes/${userId}/${orderId}/${productId}/${vendorId}`,
        formData
      );
      console.log(response.data);
      setSubmitted(true);
      setName('');
      setPhone('');
      setAddress('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting dispute:', error);
    }
  };

  return (
    <div className="dispute-wrapper">
      <form className="dispute-form" onSubmit={handleSubmit}>
        <h2>Raise a Dispute</h2>
        <p className="dispute-subtext">Please fill in the details below</p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Your Number"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
          />
          {phoneError && <span style={{ color: 'red', fontSize: '0.85rem' }}>{phoneError}</span>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            placeholder="Your current address"
            rows="2"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Dispute Message</label>
          <textarea
            placeholder="Explain your issue in detail..."
            rows="3"
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button type="submit">Submit Dispute</button>

        {submitted && (
          <p className="success-message">Your dispute has been submitted successfully!</p>
        )}
      </form>
    </div>
  );
};

export default DisputeFormPage;
