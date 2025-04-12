// UserDisputeStatus.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserDisputeStatus.css';

const UserDisputeStatus = () => {
  const { userId } = useParams();
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/disputes/user/${userId}`
        );
        setDisputes(res.data);
      } catch (err) {
        console.error('Error fetching user disputes:', err);
        setError('Failed to load disputes.');
      }
    };
    fetchDisputes();
  }, [userId]);

  if (error) return <p className="no-disputes">{error}</p>;

  return (
    <div className="user-disputes-wrapper">
      <h2>Your Disputes Status</h2>
      {disputes.length === 0 ? (
        <p className="no-disputes">No disputes found.</p>
      ) : (
        <div className="disputes-grid">
          {disputes.map(d => (
            <div key={d._id} className="dispute-card">
              {d.productImage && (
                <img
                  src={d.productImage}
                  alt={d.product.name}
                  className="product-thumb"
                />
              )}
              <div className="dispute-info">
                <p><strong>Product:</strong> {d.product.name}</p>
                <span className={`status-badge ${d.status}`}>
                  {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDisputeStatus;
