import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-3xl font-semibold">Welcome to your Dashboard</h1>
            </header>

            {/* Horizontal Navbar */}
            <nav className="flex justify-center gap-6 bg-gray-100 p-4 rounded-xl shadow mb-10">
                <Link to="dashboard-main" className="text-blue-500 hover:text-blue-700 font-medium">
                    Dashboard
                </Link>
                <Link to="add-new-book" className="text-blue-500 hover:text-blue-700 font-medium">
                    Add A Book
                </Link>
                <Link to="manage-books" className="text-blue-500 hover:text-blue-700 font-medium">
                    Manage Books
                </Link>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;
