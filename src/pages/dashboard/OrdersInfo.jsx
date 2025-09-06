import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import getBaseUrl from "../../utils/baseURL"; // update this path if needed

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-800",
  Processing: "bg-blue-200 text-blue-800",
  Shipped: "bg-purple-200 text-purple-800",
  Delivered: "bg-green-200 text-green-800",
};

function OrdersInfo() {
  const [orders, setOrders] = useState([]);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${getBaseUrl()}/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(order =>
        (!filterEmail || order.email.includes(filterEmail)) &&
        (!filterStatus || order.status === filterStatus)
      )
    : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order._id} className="border rounded p-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Ordered:</strong> {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</p>
                <p><strong>Books:</strong> {order.productIds.map(p => p.title).join(", ")}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-sm font-medium mb-2 ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersInfo;
