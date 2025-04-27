import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, FileText, Settings, MessageSquareText, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <Home size={20} /> },
    { path: '/submit', name: 'Submit Feedback', icon: <MessageSquareText size={20} /> },
    { path: '/reports', name: 'Reports', icon: <FileText size={20} /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={toggleSidebar}
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-2 rounded-lg">
                <BarChart3 size={24} />
              </div>
              <h1 className="text-lg md:text-xl font-display font-semibold text-neutral-900">
                Feedback Analyzer
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                PS
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Mobile */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        />
        
        <aside
          className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-30 transition-transform duration-300 transform md:translate-x-0 md:static md:z-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex justify-between items-center md:hidden">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                <BarChart3 size={20} />
              </div>
              <span className="font-display font-semibold">Feedback Analyzer</span>
            </div>
            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-neutral-100">
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-2 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className={location.pathname === item.path ? 'text-primary-500' : ''}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-primary-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-primary-700">Need Help?</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Check our documentation or contact support for assistance.
              </p>
              <a 
                href="#" 
                className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center"
              >
                View Documentation
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;