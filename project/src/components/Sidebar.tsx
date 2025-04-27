// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // icons

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`bg-white shadow-md h-screen fixed top-0 left-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4">
        <button onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isOpen && <h1 className="text-lg font-bold">Menu</h1>}
      </div>
      <nav className="mt-8 flex flex-col space-y-4 px-4">
        {isOpen && (
          <>
            <a href="#" className="text-neutral-700 hover:text-primary-600">Dashboard</a>
            <a href="#" className="text-neutral-700 hover:text-primary-600">Feedback</a>
            <a href="#" className="text-neutral-700 hover:text-primary-600">Reports</a>
            <a href="#" className="text-neutral-700 hover:text-primary-600">Settings</a>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
