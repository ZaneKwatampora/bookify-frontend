import React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            {/* Header */}
            <Link to="/dashboard">
                <header className="flex justify-center items-center gap-3 text-gray-800 hover:text-blue-600 transition mb-8">
                    <FaBookOpen className="text-3xl" />
                    <h1 className="text-2xl sm:text-3xl font-semibold">Bookify Dashboard</h1>
                </header>
            </Link>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;
