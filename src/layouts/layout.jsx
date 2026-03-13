import { useState } from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar';   

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
      />
      <Topbar setSidebarOpen={setSidebarOpen} />
      {/* Content with fixed sidebar margin */}
      <main className="pt-20 p-6 lg:ml-64">
        {children}
      </main>
    </div>
  );
}