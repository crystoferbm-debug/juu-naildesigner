
import React, { useRef } from 'react';
import { HomeIcon, UsersIcon, CalendarIcon, NailPolishIcon, LogOutIcon, DownloadIcon, UploadIcon } from './Icons';

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const backupData: { [key: string]: string | null } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('naildash_') || key.startsWith('clients_') || key.startsWith('appointments_'))) {
          backupData[key] = localStorage.getItem(key);
        }
      }
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'naildash_backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      alert('Ocorreu um erro ao exportar os dados.');
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Formato de arquivo inválido.");
        }
        const data = JSON.parse(text);
        
        if (!data.naildash_users) {
          throw new Error("Arquivo de backup não parece ser válido.");
        }

        if (window.confirm('Atenção: A importação de dados substituirá todas as informações atuais. Deseja continuar?')) {
          Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') {
               localStorage.setItem(key, data[key]);
            }
          });
          alert('Dados importados com sucesso! A aplicação será recarregada.');
          window.location.reload();
        }
      } catch (error) {
        console.error("Erro ao importar dados:", error);
        alert(`Ocorreu um erro ao importar os dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
        // Reset file input value to allow importing the same file again
        if(fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

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
        <div className='px-4 py-3 mb-2 border-t border-b border-pink-100'>
            <p className='text-sm font-medium text-slate-700'>Logada como:</p>
            <p className='text-sm font-bold text-pink-700 truncate'>{username}</p>
        </div>
        
        {/* Data Management */}
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={handleImportClick} className="flex items-center w-full text-left px-4 py-3 my-1 rounded-lg text-slate-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-200">
            <UploadIcon className="h-6 w-6 mr-3" />
            <span className="text-sm font-semibold">Importar Dados</span>
        </button>
         <button onClick={handleExport} className="flex items-center w-full text-left px-4 py-3 my-1 rounded-lg text-slate-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-200">
            <DownloadIcon className="h-6 w-6 mr-3" />
            <span className="text-sm font-semibold">Exportar Dados</span>
        </button>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="flex items-center px-4 py-3 mt-2 rounded-lg text-slate-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-200 border-t border-pink-100"
        >
          <LogOutIcon className="h-6 w-6 mr-3" />
          <span className="text-sm font-semibold">Sair</span>
        </a>
      </div>
    </nav>
  );
};