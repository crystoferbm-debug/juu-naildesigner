
import React from 'react';
import type { Client, Appointment } from '../types';
import { SERVICES } from '../constants';

interface ScheduleProps {
  clients: Client[];
  appointments: Appointment[];
  updateAppointmentStatus: (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') => void;
}

const AppointmentCard: React.FC<{
  appointment: Appointment;
  client?: Client;
  onStatusChange: (status: 'scheduled' | 'completed' | 'cancelled') => void;
}> = ({ appointment, client, onStatusChange }) => {
  const service = SERVICES.find(s => s.id === appointment.serviceId);
  const statusClasses = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  const statusLabels = {
    scheduled: 'Agendado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img className="h-12 w-12 rounded-full object-cover border-2 border-pink-200" src={client?.avatarUrl} alt={client?.name} />
          <div>
            <h3 className="text-md font-bold text-slate-800">{client?.name}</h3>
            <p className="text-sm text-slate-500">{service?.name || 'Serviço'}</p>
          </div>
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[appointment.status]}`}>
            {statusLabels[appointment.status]}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
        <span className="text-slate-600 font-medium">
          {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex space-x-2">
            {appointment.status === 'scheduled' && (
              <>
                <button onClick={() => onStatusChange('completed')} className="text-xs font-medium text-green-600 hover:text-green-800">Concluir</button>
                <button onClick={() => onStatusChange('cancelled')} className="text-xs font-medium text-red-600 hover:text-red-800">Cancelar</button>
              </>
            )}
            {appointment.status !== 'scheduled' && (
              <button onClick={() => onStatusChange('scheduled')} className="text-xs font-medium text-blue-600 hover:text-blue-800">Reagendar</button>
            )}
        </div>
      </div>
    </div>
  );
};


export const Schedule: React.FC<ScheduleProps> = ({ clients, appointments, updateAppointmentStatus }) => {
  
  const groupedAppointments = appointments.reduce((acc, appt) => {
    const date = new Date(appt.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    // a bit of a hack for pt-BR date format
    const aParts = a.split(' de ');
    const bParts = b.split(' de ');
    const dateAProper = new Date(`${aParts[2]}-${aParts[1]}-${aParts[0]}`);
    const dateBProper = new Date(`${bParts[2]}-${bParts[1]}-${bParts[0]}`);
    
    // A more robust way
    const parsePtBrDate = (dateStr: string) => {
      const months: { [key: string]: number } = { 'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11 };
      const parts = dateStr.split(' de ');
      return new Date(parseInt(parts[2]), months[parts[1].toLowerCase()], parseInt(parts[0]));
    };

    return parsePtBrDate(a).getTime() - parsePtBrDate(b).getTime();
  });


  return (
    <div className="space-y-8">
      {sortedDates.length > 0 ? sortedDates.map(date => (
        <div key={date}>
          <h2 className="text-lg font-bold text-pink-700 mb-4 pb-2 border-b-2 border-pink-200">{date}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groupedAppointments[date]
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(appt => (
              <AppointmentCard 
                key={appt.id}
                appointment={appt} 
                client={clients.find(c => c.id === appt.clientId)}
                onStatusChange={(status) => updateAppointmentStatus(appt.id, status)}
              />
            ))}
          </div>
        </div>
      )) : (
         <div className="text-center py-16">
          <p className="text-slate-500">Nenhum agendamento encontrado.</p>
        </div>
      )}
    </div>
  );
};
