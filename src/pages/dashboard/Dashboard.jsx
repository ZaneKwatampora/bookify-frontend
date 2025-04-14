import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md';
import RevenueChart from './RevenueChart';

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
      {/* Metric Cards */}
      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {/* Total Books */}
        <div className="flex items-center p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <div className="flex items-center justify-center h-14 w-14 text-purple-600 bg-purple-100 rounded-full mr-4">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">{data?.totalBooks}</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="flex items-center p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <div className="flex items-center justify-center h-14 w-14 text-green-600 bg-green-100 rounded-full mr-4">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">${data?.totalSales}</div>
            <div className="text-sm text-gray-500">Total Sales</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="flex items-center p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <div className="flex items-center justify-center h-14 w-14 text-blue-600 bg-blue-100 rounded-full mr-4">
            <MdIncompleteCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data?.totalOrders}</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
        </div>
      </section>

      {/* Chart & Other Metrics */}
      <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
        {/* Revenue Chart */}
        <div className="md:col-span-2 md:row-span-2 bg-white shadow-md rounded-xl p-6 flex flex-col">
          <div className="font-semibold text-lg border-b pb-2 mb-4">Orders per Month</div>
          <div className="flex-grow">
            <RevenueChart />
          </div>
        </div>

        {/* Orders Left */}
        <div className="flex items-center p-6 bg-white shadow-md rounded-xl">
          <div className="h-14 w-14 flex items-center justify-center text-yellow-600 bg-yellow-100 rounded-full mr-4">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path fill="#fff" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">02</div>
            <div className="text-sm text-gray-500">Orders Left</div>
          </div>
        </div>

        {/* Website Visits */}
        <div className="flex items-center p-6 bg-white shadow-md rounded-xl">
          <div className="h-14 w-14 flex items-center justify-center text-teal-600 bg-teal-100 rounded-full mr-4">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold">139</div>
            <div className="text-sm text-gray-500">Website Visits (Last Day)</div>
          </div>
        </div>

        {/* Top Users */}
        <div className="row-span-3 bg-white shadow-md rounded-xl p-6 overflow-y-auto max-h-[26rem]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Top Users</h3>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              Descending
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <ul className="space-y-4">
            {[
              { name: 'Annette Watson', img: 82, score: '9.3' },
              { name: 'Calvin Steward', img: 81, score: '8.9' },
              { name: 'Ralph Richards', img: 80, score: '8.7' },
              { name: 'Bernard Murphy', img: 79, score: '8.2' },
              { name: 'Arlene Robertson', img: 78, score: '8.2' },
              { name: 'Jane Lane', img: 77, score: '8.1' },
              { name: 'Pat Mckinney', img: 76, score: '7.9' },
              { name: 'Norman Walters', img: 75, score: '7.7' },
            ].map(({ name, img, score }, idx) => (
              <li key={idx} className="flex items-center">
                <img className="h-10 w-10 rounded-full object-cover mr-3" src={`https://randomuser.me/api/portraits/${img % 2 === 0 ? 'women' : 'men'}/${img}.jpg`} alt={`${name} profile`} />
                <span className="text-gray-700">{name}</span>
                <span className="ml-auto font-semibold">{score}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
