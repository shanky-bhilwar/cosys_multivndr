 {/* this is the dispute order page where we gonna show the all orders of the specific user and then these orders will have the links which will decide which order have dispute*/}

// src/pages/DisputeOrderPage.jsx
// src/pages/DisputeOrderPage.jsx
// src/pages/DisputeOrderPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DisputeOrderPage.css";

const DisputeOrderPage = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/userorder/${userId}`
        );
        setOrders(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading) return <p className="dispute-loading">Loading orders…</p>;
  if (error) return <p className="dispute-error">{error}</p>;

  return (
    <div className="dispute-container">
      <h1 className="dispute-title">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="dispute-empty">You have no orders.</p>
      ) : (
        <div className="dispute-list">
          {orders.map((order) => {
            const item = order.items[0];
            const product = item.product;

            return (
              <div className="dispute-card" key={order._id}>
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="dispute-image"
                  />
                )}

                <div className="dispute-details">
                  <h2 className="dispute-product">{product.name}</h2>
                  <p>
                    Quantity: <strong>{item.quantity}</strong>
                  </p>
                  <p>
                    Amount: ₹
                    <strong>{item.quantity * product.price}</strong>
                  </p>
                </div>

                <Link
                  to={`/disputeform/${userId}/${order.vendor}/${product._id}/${order._id}`}
                  className="dispute-button"
                >
                  Dispute
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DisputeOrderPage;







