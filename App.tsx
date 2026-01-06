
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Schedule } from './components/Schedule';
import { Header } from './components/Header';
import type { Client, Appointment } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DUMMY_CLIENTS, DUMMY_APPOINTMENTS } from './constants';

type View = 'dashboard' | 'clients' | 'schedule';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [clients, setClients] = useLocalStorage<Client[]>('clients', DUMMY_CLIENTS);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', DUMMY_APPOINTMENTS);

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: `client_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
  };
  
  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
    };
    setAppointments(prev => {
      const sorted = [...prev, newAppointment];
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return sorted;
    });
  };

  const updateAppointmentStatus = (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    setAppointments(prev => prev.map(appt => appt.id === appointmentId ? { ...appt, status } : appt));
  };
  
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    setAppointments(prev => prev.filter(appt => appt.clientId !== clientId));
  };

  const renderView = () => {
    const props = { clients, appointments, addClient, addAppointment, deleteClient, updateAppointmentStatus };
    switch (currentView) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'clients':
        return <Clients {...props} />;
      case 'schedule':
        return <Schedule {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  return (
    <div className="flex h-screen bg-pink-50 text-slate-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          clients={clients} 
          addClient={addClient} 
          addAppointment={addAppointment} 
          currentView={currentView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-pink-50 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
