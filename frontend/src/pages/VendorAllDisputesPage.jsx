// VendorAllDisputesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './VendorAllDisputesPage.css';

const VendorAllDisputesPage = () => {
  const { vendorId } = useParams();
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/disputes/vendor/${vendorId}`);
        setDisputes(res.data);
      } catch (err) {
        console.error('Error fetching disputes:', err);
      }
    };
    fetchDisputes();
  }, [vendorId]);

  const handleStatusChange = async (disputeId, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/disputes/${disputeId}/status`, { status: newStatus });
      setDisputes(prev => prev.map(d => d._id === disputeId ? { ...d, status: res.data.status } : d));
      console.log('Patch response:', res.data);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="vendor-disputes-wrapper">
      <h2>All Disputes for You</h2>
      {disputes.length === 0 ? (
        <p className="no-disputes">No disputes found.</p>
      ) : (
        <div className="disputes-grid">
          {disputes.map(dispute => (
            <div key={dispute._id} className="dispute-card">
              {dispute.productImage && (
                <img src={dispute.productImage} alt="Product" className="product-thumb" />
              )}
              <div className="dispute-info">
                <p><strong>Product:</strong> {dispute.product?.name}</p>
                <p><strong>Customer Name:</strong> {dispute.name}</p>
                <p><strong>Phone:</strong> {dispute.phone}</p>
                <p><strong>Email:</strong> {dispute.user?.email}</p>
                <p><strong>Address:</strong> {dispute.address}</p>
                <p><strong>Message:</strong> {dispute.message}</p>
                <p><strong>Status:</strong> {dispute.status}</p>
                <select
                  className="status-dropdown"
                  value={dispute.status}
                  onChange={e => handleStatusChange(dispute._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorAllDisputesPage;
