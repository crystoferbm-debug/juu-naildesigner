
import React from 'react';
import { HomeIcon, UsersIcon, CalendarIcon, NailPolishIcon, LogOutIcon } from './Icons';

type View = 'dashboard' | 'clients' | 'schedule';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  username: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout, username }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'clients', label: 'Clientes', icon: UsersIcon },
    { id: 'schedule', label: 'Agenda', icon: CalendarIcon },
  ];

  const NavLink: React.FC<{
    id: View;
    label: string;
    icon: React.ElementType;
  }> = ({ id, label, icon: Icon }) => {
    const isActive = currentView === id;
    const baseClasses = 'flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200';
    const activeClasses = 'bg-pink-200 text-pink-800 font-semibold shadow-inner';
    const inactiveClasses = 'text-slate-600 hover:bg-pink-100 hover:text-pink-700';

    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentView(id);
        }}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <Icon className="h-6 w-6 mr-3" />
        <span className="text-sm">{label}</span>
      </a>
    );
  };

  return (
    <nav className="w-64 bg-white/70 backdrop-blur-lg border-r border-pink-200/50 p-4 shadow-lg flex-shrink-0 hidden md:flex flex-col">
      <div className="flex items-center space-x-2 px-2 mb-8">
        <NailPolishIcon className="h-8 w-8 text-pink-500"/>
        <span className="text-xl font-bold text-pink-800">NailDash</span>
      </div>
      <div className="flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            id={item.id as View}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </div>
      <div className="mt-auto">
        <div className='px-4 py-3 mb-2'>
            <p className='text-sm font-medium text-slate-700'>Logada como:</p>
            <p className='text-sm font-bold text-pink-700 truncate'>{username}</p>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center px-4 py-3 my-1 rounded-lg text-slate-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-200"
        >
          <LogOutIcon className="h-6 w-6 mr-3" />
          <span className="text-sm font-semibold">Sair</span>
        </a>
      </div>
    </nav>
  );
};