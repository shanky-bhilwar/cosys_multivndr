// in vendor dashboard we are adding thiss  sample id to check if the dashboard is showing the data 
// by vendor id or not and we will only get working vendor id when arawind finishes  his  task
// so for now we will use this - 67f0d92cb44e85c3fd80058f 
// temp id that we created using the mongodb shell sample data creation 
// bus kudh se url me vendor id daldenge vendor dashboard par aane ke baad 
// or fir useparams use fetch krke get request bhej dega backend ko 
// i added the charts just to make it look dynamic im not understanding the charts
// my  task was only to show the  numbers in divs of "" sales,products,orders "
//******************************************************************************* */

//*********** give this id in the params when showing vendor dashboard ***********/
//vendor id -    67f0d92cb44e85c3fd80058f


// VendorDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./VendorDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const VendorDashboard = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};
  const userId = decoded?.id;

  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    vendor: { name: "" },
    productCount: 0,
    orderCount: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(0);
  const [adminCommission, setAdminCommission] = useState(0);
  const [vendorRevenue, setVendorRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [
          statsRes,
          ordersRes,
          productsRes,
          salesRes,
          revenueRes,
        ] = await Promise.all([
          axios.get(`http://localhost:5000/api/vendor/${vendorId}/stats`),
          axios.get(`http://localhost:5000/api/vendor/${vendorId}/orders`),
          axios.get(`http://localhost:5000/api/vendor/${vendorId}/products`),
          axios.get(`http://localhost:5000/api/vendor/${vendorId}/sales`),
          axios.get(`http://localhost:5000/api/vendor/${vendorId}/commission`),
        ]);

        const s = statsRes.data || {};
        setStats({
          vendor: s.vendor || { name: "" },
          productCount: s.productCount || 0,
          orderCount: s.orderCount || 0,
          totalRevenue: s.totalRevenue || 0,
        });

        setOrders(
          Array.isArray(ordersRes.data.orders) ? ordersRes.data.orders : []
        );
        setProducts(
          Array.isArray(productsRes.data.products)
            ? productsRes.data.products
            : []
        );

        // Compute sales & commission
        const gross =
          typeof salesRes.data.totalRevenue === "number"
            ? salesRes.data.totalRevenue
            : 0;
        const comm = revenueRes.data.adminCommission || 0;

        setSales(gross);
        setAdminCommission(comm);
        setVendorRevenue(gross - comm);
      } catch (err) {
        console.error("Error fetching vendor dashboard:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [vendorId]);

  if (loading) return <div className="vd-message">Loading...</div>;
  if (error) return <div className="vd-message vd-error">{error}</div>;

  const completedOrders = orders.filter(
    (o) => o.paymentStatus === "completed"
  );
  const pendingOrders = orders.filter((o) => o.paymentStatus === "pending");

  const statusData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [stats.orderCount, orders.length - stats.orderCount],
        backgroundColor: ["#28a745", "#ffc107"],
      },
    ],
  };

  const stockData = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Stock",
        data: products.map((p) => p.stock),
        backgroundColor: "#007bff",
      },
    ],
  };

  const salesTrend = {
    labels: orders.map((o) =>
      new Date(o.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Revenue",
        data: orders.map((o) => o.totalAmount),
        borderColor: "#17a2b8",
        fill: false,
      },
    ],
  };

  const topMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((it) => {
      if (it.product.vendor.toString() === vendorId) {
        const name = it.product.name;
        topMap[name] = (topMap[name] || 0) + it.quantity;
      }
    });
  });

  const topNames = Object.keys(topMap);
  const topData = {
    labels: topNames,
    datasets: [
      {
        label: "Units Sold",
        data: topNames.map((n) => topMap[n]),
        backgroundColor: "#dc3545",
      },
    ],
  };

  return (
    <div className="vd-container">
      <h1 className="vd-title">
        {stats.vendor.name
          ? `${stats.vendor.name}’s Dashboard`
          : "Vendor Dashboard"}
      </h1>

      <div className="stat-cards">
        <div className="stat-card">
          <h3>Products</h3>
          <p>{stats.productCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p>{completedOrders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>₹{sales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Admin Commission</h3>
          <p>₹{adminCommission.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Net Revenue</h3>
          <p>₹{vendorRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="vd-chart-row">
        <div className="vd-section">
          <h2>Order Status</h2>
          <Doughnut data={statusData} />
        </div>
        <div className="vd-section">
          <h2>Stock Levels</h2>
          <Bar data={stockData} />
        </div>
      </div>

      <div className="vd-chart-row">
        <div className="vd-section">
          <h2>Sales Trend</h2>
          <Line data={salesTrend} />
        </div>
        <div className="vd-section">
          <h2>Top Selling Products</h2>
          <Bar data={topData} />
        </div>
      </div>


{/* from here we are starting our dispute code here , on top of this dashboard code
  we getting token we gonna get token that we have set manually in homepage 
  and we will take out id from that token 
  and down here in this code we gonna use the id in this Link to = "" so we can go to specific
  user page  */}



  
<Link to={`/dispute/${userId}`}>
  <button style={{padding: '10px 20px',backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px',cursor: 'pointer',fontSize: '16px' }}>
    Go to users orders for Disputes
  </button>
</Link>

{/* this button is for the vendor to see how many disputes he got "all disputed" and 
also we already have vendorId from the vendor dashboard so we are not collecting it from local storage */}
  

  <Link to={`/vendor/alldisputes/${vendorId}`}>
  <button style={{padding: '10px 20px',backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '5px',cursor: 'pointer',fontSize: '16px' }}>
   View all vendors disputes
  </button>
</Link>

{/* now from this button user will see his all the disputes he sent and the status or it  */}

<Link to={`/user/disputesStatus/${userId}`}>
  <button style={{padding: '10px 20px',backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '5px',cursor: 'pointer',fontSize: '16px' }}>
   View User dispute status
  </button>
</Link>


{/* ---- this is the arawind ui of vendor order management */}

<Link to={`/vendor/Allorders/${vendorId}`}>
  <button style={{padding: '10px 20px',backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '5px',cursor: 'pointer',fontSize: '16px' }}>
   Vendor Order Management
  </button>
</Link>

    </div>




  );
};

export default VendorDashboard;


