
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Schedule } from './components/Schedule';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import type { Client, Appointment, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'dashboard' | 'clients' | 'schedule';

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useLocalStorage<User | null>('naildash_session', null);
  const [users, setUsers] = useLocalStorage<User[]>('naildash_users', []);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Create dynamic keys for localStorage based on the logged-in user
  const clientsKey = loggedInUser ? `clients_${loggedInUser.id}` : 'clients_anonymous';
  const appointmentsKey = loggedInUser ? `appointments_${loggedInUser.id}` : 'appointments_anonymous';

  const [clients, setClients] = useLocalStorage<Client[]>(clientsKey, []);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(appointmentsKey, []);

  const handleRegister = (username: string, password: string): boolean => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('Este nome de usuário já está em uso.');
        return false;
    }
    const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        // In a real application, NEVER store plain text passwords. This should be a securely generated hash.
        passwordHash: password,
    };
    setUsers([...users, newUser]);
    alert('Usuário registrado com sucesso! Por favor, faça o login.');
    return true;
  };

  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    // In a real application, you would compare the hashed password.
    if (user && user.passwordHash === password) {
        setLoggedInUser(user);
        return true;
    }
    alert('Nome de usuário ou senha inválidos.');
    return false;
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    // Clear data for anonymous user to avoid data leaks between sessions
    setClients([]);
    setAppointments([]);
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

  const addClient = (
    client: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>,
    appointmentData?: { serviceId: string; date: string }
  ) => {
    const clientId = `client_${Date.now()}`;
    const newClient: Client = {
      ...client,
      id: clientId,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://picsum.photos/seed/${clientId}/200/200`,
    };
    setClients(prev => [newClient, ...prev]);

    if (appointmentData) {
      addAppointment({
        clientId: newClient.id,
        ...appointmentData,
      });
    }
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
  
  if (!loggedInUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex h-screen bg-pink-50 text-slate-800">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={handleLogout} 
        username={loggedInUser.username}
      />
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