import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel,
  Button
} from "@mui/material";
import axios from "axios";
import FileDownload from "js-file-download";
import { useParams } from 'react-router-dom';

const VendorOrderManagement = () => {
  const { vendorId } = useParams();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch orders for this vendor
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/vendororder/${vendorId}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  // Update status and refresh
  const handleStatusChange = async (orderId, newStatus) => {
    try {
     const res =  await axios.put(
        `http://localhost:5000/api/orders/updateorder/${orderId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res.data);
      await fetchOrders();
       } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  // Export CSV
  const handleExport = () => {
    const filtered = filterStatus
      ? orders.filter((o) => o.status === filterStatus)
      : orders;

    const csvHeader = "OrderID,User,Product,Vendor,Qty,Amount,Status\n";
    const csvData = filtered
      .flatMap((order) =>
        order.items.map((item) =>
          `${order._id},${order.user?.name || ""},${item.product?.name || ""},${item.vendor?.name || ""},${item.quantity},${item.product?.price * item.quantity},${order.status}`
        )
      )
      .join("\n");

    FileDownload(csvHeader + csvData, "orders.csv");
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleExport}>
          Export CSV
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Update Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) =>
                order.items.map((item, idx) => (
                  <TableRow key={`${order._id}-${item._id}`}>
                    <TableCell>{idx === 0 ? order._id : ""}</TableCell>
                    <TableCell>{idx === 0 ? order.user?.name : ""}</TableCell>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.vendor?.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      ₹{(item.product?.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {idx === 0 ? order.paymentStatus : ""}
                    </TableCell>
                    <TableCell>{idx === 0 ? order.status : ""}</TableCell>
                    <TableCell>
                      {idx === 0 && (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={order.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VendorOrderManagement;
