
import React, { useState } from 'react';
import { AddClientModal } from './AddClientModal';
import { AddAppointmentModal } from './AddAppointmentModal';
import { PlusIcon } from './Icons';
import type { Client, Appointment } from '../types';

interface HeaderProps {
  currentView: string;
  clients: Client[];
  addClient: (
    client: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>,
    appointmentData?: { serviceId: string; date: string; price: number }
  ) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, clients, addClient, addAppointment }) => {
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  
  const viewTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    clients: 'Gerenciar Clientes',
    schedule: 'Agenda de Compromissos',
  };

  return (
    <>
      <header className="bg-white/50 backdrop-blur-md border-b border-pink-200/50 p-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-pink-800">{viewTitles[currentView]}</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setAppointmentModalOpen(true)}
            className="hidden sm:flex items-center justify-center bg-white text-pink-600 px-4 py-2 rounded-lg shadow-sm border border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 text-sm font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Agendamento
          </button>
          <button 
            onClick={() => setClientModalOpen(true)}
            className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition-all duration-200 text-sm font-medium"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Nova Cliente
          </button>
        </div>
      </header>
      <AddClientModal
        isOpen={isClientModalOpen}
        onClose={() => setClientModalOpen(false)}
        onAddClient={addClient}
      />
      <AddAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onAddAppointment={addAppointment}
        clients={clients}
      />
    </>
  );
};