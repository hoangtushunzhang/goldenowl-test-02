import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuSelect?: (menu: 'search' | 'reports') => void;
}

export default function Sidebar({ isOpen, onClose, onMenuSelect }: SidebarProps) {
  return (
    <>
  
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 sm:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto backdrop-blur-md' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>

      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64
          bg-gradient-to-b from-yellow-400 via-yellow-300 to-teal-400
          p-6 shadow-md z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:relative
          ${isOpen ? 'block' : 'hidden'} sm:block
        `}
      >
        
        <button
          className="absolute top-2 right-2 text-2xl sm:hidden focus:outline-none"
          onClick={onClose}
          aria-label="Đóng sidebar"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-700">Menu</h2>
        <ul className="space-y-4">
          <li><a href="#" className="text-black" onClick={onClose}>Dashboard</a></li>
          <li><a href="#" className="font-semibold text-gray-700" onClick={() => { if (onMenuSelect) onMenuSelect('search'); onClose(); }}>Search Scores</a></li>
          <li><a href="#" className="text-black" onClick={() => { if (onMenuSelect) onMenuSelect('reports'); onClose(); }}>Reports</a></li>
          <li><a href="#" className="text-black" onClick={onClose}>Settings</a></li>
        </ul>
      </aside>
    </>
  );
}
