
import React from 'react';
import type { Client, Appointment } from '../types';
import { SERVICES } from '../constants';
import { UsersIcon, CalendarIcon, NailPolishIcon } from './Icons';

interface DashboardProps {
  clients: Client[];
  appointments: Appointment[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-transform hover:scale-105 duration-300">
        <div className="bg-pink-100 p-3 rounded-full">
            <Icon className="h-7 w-7 text-pink-600" />
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const AppointmentItem: React.FC<{ appointment: Appointment, client?: Client }> = ({ appointment, client }) => {
    const service = SERVICES.find(s => s.id === appointment.serviceId);
    return (
        <li className="flex items-center space-x-4 p-3 bg-pink-50/50 rounded-lg hover:bg-pink-100 transition-colors">
            <img className="h-10 w-10 rounded-full object-cover" src={client?.avatarUrl} alt={client?.name} />
            <div className="flex-1">
                <p className="font-semibold text-slate-700">{client?.name}</p>
                <p className="text-sm text-slate-500">{service?.name || 'Serviço desconhecido'}</p>
            </div>
            <div className="text-right">
                <p className="font-medium text-pink-600">{new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-slate-400">{new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
            </div>
        </li>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ clients, appointments }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments
        .filter(a => new Date(a.date) >= today && a.status === 'scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const recentClients = [...clients]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
        
    const completedThisMonth = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return a.status === 'completed' && apptDate.getMonth() === today.getMonth() && apptDate.getFullYear() === today.getFullYear();
    }).length;

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total de Clientes" value={clients.length} icon={UsersIcon} />
                <StatCard title="Próximos Agendamentos" value={upcomingAppointments.length} icon={CalendarIcon} />
                <StatCard title="Serviços Concluídos (Mês)" value={completedThisMonth} icon={NailPolishIcon} />
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Próximos Agendamentos</h2>
                    {upcomingAppointments.length > 0 ? (
                        <ul className="space-y-3">
                            {upcomingAppointments.map(appt => (
                                <AppointmentItem 
                                    key={appt.id} 
                                    appointment={appt} 
                                    client={clients.find(c => c.id === appt.clientId)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-500 py-8">Nenhum agendamento futuro.</p>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Clientes Recentes</h2>
                    {recentClients.length > 0 ? (
                        <ul className="space-y-3">
                            {recentClients.map(client => (
                                <li key={client.id} className="flex items-center space-x-4 p-3 bg-pink-50/50 rounded-lg hover:bg-pink-100 transition-colors">
                                    <img className="h-10 w-10 rounded-full object-cover" src={client.avatarUrl} alt={client.name} />
                                    <div>
                                        <p className="font-semibold text-slate-700">{client.name}</p>
                                        <p className="text-sm text-slate-500">Registrada em {new Date(client.createdAt).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-500 py-8">Nenhuma cliente registrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
