import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle, MdPeople } from 'react-icons/md';
import RevenueChart from '../dashboard/RevenueChart';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Books */}
        <DashboardCard
          to="/dashboard/manage-books"
          icon={
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          value={data?.totalBooks}
          label="Products"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        {/* Total Sales */}
        <DashboardCard
          to="/dashboard/sales"
          icon={
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          value={`$${data?.totalSales}`}
          label="Total Sales"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        {/* Total Orders */}
        <DashboardCard
          to="/dashboard/orders"
          icon={<MdIncompleteCircle className="w-6 h-6" />}
          value={data?.totalOrders}
          label="Total Orders"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        {/* Total Users */}
        <DashboardCard
          to="/dashboard/user"
          icon={<MdPeople className="w-6 h-6" />}
          value={data?.totalUsers ?? '—'}
          label="Users"
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
      </section>

      {/* Chart Section */}
      <div className="mt-10">
        <RevenueChart />
      </div>
    </div>
  );
};

export default Dashboard;

// Reusable Dashboard Card
const DashboardCard = ({ to, icon, value, label, iconColor, iconBg }) => (
  <Link to={to} className="flex items-center p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition">
    <div className={`flex items-center justify-center h-14 w-14 ${iconColor} ${iconBg} rounded-full mr-4`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </Link>
);
