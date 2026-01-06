
import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Client } from '../types';
import { SERVICES } from '../constants';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (
    client: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>,
    appointmentData?: { serviceId: string; date: string }
  ) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAddClient }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert('Por favor, preencha nome, telefone e email.');
      return;
    }
    
    let appointmentData: { serviceId: string; date: string; } | undefined = undefined;

    if (serviceId && date && time) {
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        const appointmentDate = new Date(year, month - 1, day, hours, minutes);
        appointmentData = {
            serviceId,
            date: appointmentDate.toISOString(),
        };
    }

    onAddClient({ name, phone, email, notes }, appointmentData);
    
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setServiceId('');
    setDate('');
    setTime('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setServiceId('');
    setDate('');
    setTime('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar Nova Cliente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nome Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Observações</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            placeholder="Preferências, alergias, etc."
          ></textarea>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="block text-md font-semibold text-slate-800 mb-1">Primeiro Agendamento <span className="text-sm font-normal text-slate-500">(Opcional)</span></h3>
            <p className="text-sm text-slate-500 mb-4">Adicione o primeiro serviço para esta cliente agora mesmo.</p>
            <div className="space-y-4">
                <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700">Serviço</label>
                <select id="service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md">
                    <option value="" disabled>Selecione um serviço</option>
                    {SERVICES.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Data</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-700">Hora</label>
                    <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"/>
                </div>
                </div>
            </div>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-pink-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
            Salvar Cliente
          </button>
        </div>
      </form>
    </Modal>
  );
};