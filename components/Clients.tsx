
import React, { useState } from 'react';
import type { Client, Appointment } from '../types';
import { SearchIcon, TrashIcon } from './Icons';

interface ClientsProps {
  clients: Client[];
  appointments: Appointment[];
  deleteClient: (clientId: string) => void;
}

const ClientCard: React.FC<{ client: Client; appointmentCount: number; onDelete: () => void }> = ({ client, appointmentCount, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm(`Tem certeza que deseja excluir ${client.name}? Todos os agendamentos dela serão removidos.`)){
      onDelete();
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img className="h-16 w-16 rounded-full object-cover border-2 border-pink-200" src={client.avatarUrl} alt={client.name} />
          <div>
            <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
            <p className="text-sm text-slate-500">{client.phone}</p>
            <p className="text-sm text-pink-600 truncate">{client.email}</p>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Excluir cliente"
        >
          <TrashIcon className="h-5 w-5"/>
        </button>
      </div>
      {client.notes && <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-md border-l-4 border-pink-300">"{client.notes}"</p>}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
        <span className="text-slate-500">Cliente desde: <span className="font-medium text-slate-600">{new Date(client.createdAt).toLocaleDateString('pt-BR')}</span></span>
        <span className="text-pink-700 bg-pink-100 px-3 py-1 rounded-full font-semibold">{appointmentCount} agendamentos</span>
      </div>
    </div>
  );
};


export const Clients: React.FC<ClientsProps> = ({ clients, appointments, deleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-sm border border-slate-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      </div>
      
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map(client => {
            const appointmentCount = appointments.filter(a => a.clientId === client.id).length;
            return (
              <ClientCard 
                key={client.id} 
                client={client} 
                appointmentCount={appointmentCount} 
                onDelete={() => deleteClient(client.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500">Nenhuma cliente encontrada.</p>
        </div>
      )}
    </div>
  );
};