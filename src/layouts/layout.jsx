import { useState } from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar';   

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/80 to-rose-100/50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
      />
      <Topbar setSidebarOpen={setSidebarOpen} />
      {/* Content with fixed sidebar margin */}
      <main className="pt-20 px-4 pb-6 sm:px-6 lg:px-8 lg:ml-64">
        {children}
      </main>
    </div>
  );
}