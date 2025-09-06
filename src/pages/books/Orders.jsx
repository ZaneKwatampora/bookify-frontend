import React, { useState } from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import { Clock, CheckCircle2, Truck, Hourglass } from 'lucide-react';

const statusConfig = {
  Pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Hourglass className="inline w-4 h-4 mr-1" /> },
  Processing: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="inline w-4 h-4 mr-1" /> },
  Shipped: { color: 'bg-purple-100 text-purple-800', icon: <Truck className="inline w-4 h-4 mr-1" /> },
  Delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="inline w-4 h-4 mr-1" /> },
};

const Orders = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

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

      {filteredOrders.length === 0 ? (
        <div>No orders found!</div>
      ) : (
        <div>
          {filteredOrders.map((order, index) => (
            <div key={order._id} className="border-b mb-4 pb-4">
              <p className='p-1 bg-black text-center text-white w-10 rounded mb-1'># {index + 1}</p>
              <h2 className="font-bold">Order ID: {order._id}</h2>
              <p className="text-gray-600">Total Price: ${order.totalPrice}</p>
              <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600 font-semibold flex items-center gap-2">
                Status:
                <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${statusConfig[order.status]?.color}`}>
                  {statusConfig[order.status]?.icon}
                  {order.status}
                </span>
              </p>
              <h3 className="font-semibold mt-2">Books:</h3>
              <ul>
                {order.productIds.map((product) => (
                  <li key={product._id || product}>{product.title || product}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
