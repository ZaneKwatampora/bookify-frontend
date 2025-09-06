import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';
import Loading from '../../../components/Loading';
import { Clock, CheckCircle2, Truck, Hourglass } from 'lucide-react';

const statusConfig = {
  Pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Hourglass className="inline w-4 h-4 mr-1" /> },
  Processing: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="inline w-4 h-4 mr-1" /> },
  Shipped: { color: 'bg-purple-100 text-purple-800', icon: <Truck className="inline w-4 h-4 mr-1" /> },
  Delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="inline w-4 h-4 mr-1" /> },
};

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("latest");

  const filteredOrders = orders
    .filter(order => statusFilter === "All" || order.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateSort === "latest" ? dateB - dateA : dateA - dateB;
    });

  if (isLoading) return <div><Loading /></div>;
  if (isError) return <div>Error getting orders data</div>;

  return (
    <div className="bg-gray-100 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          {currentUser?.displayName || currentUser?.email?.split("@")[0]}'s Dashboard
        </h1>
        <p className="text-gray-700 mb-6">
          Welcome, {currentUser?.displayName || currentUser?.email?.split("@")[0]}! Here are your recent orders:
        </p>

        <div className="flex gap-4 mb-6 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {filteredOrders.length > 0 ? (
            <ul className="space-y-4">
              {filteredOrders.map((order) => (
                <li key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-2">
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                  <p>Total: ${order.totalPrice}</p>
                  <p className="flex items-center gap-2">
                    Status:
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${statusConfig[order.status]?.color}`}>
                      {statusConfig[order.status]?.icon}
                      {order.status}
                    </span>
                  </p>
                  <div>
                    <h4 className="font-semibold mt-2">Books:</h4>
                    <ul className="ml-4 list-disc">
                      {order.productIds.map((product) => (
                        <li key={product._id || product}>{product.title || product}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
