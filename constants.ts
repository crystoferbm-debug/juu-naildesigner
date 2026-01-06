
import type { Service, Client, Appointment } from './types';

export const SERVICES: Service[] = [
  { id: 'manicure_classic', name: 'Manicure Clássica', price: 30, duration: 45 },
  { id: 'pedicure_classic', name: 'Pedicure Clássica', price: 40, duration: 60 },
  { id: 'gel_nails', name: 'Unhas de Gel', price: 120, duration: 120 },
  { id: 'nail_art', name: 'Nail Art (por unha)', price: 10, duration: 15 },
  { id: 'manicure_gel', name: 'Manicure em Gel', price: 80, duration: 90 },
  { id: 'maintenance', name: 'Manutenção', price: 90, duration: 100 },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);


export const DUMMY_CLIENTS: Client[] = [
    { id: 'client_1', name: 'Ana Silva', phone: '(11) 98765-4321', email: 'ana.silva@example.com', createdAt: new Date('2023-10-15').toISOString(), avatarUrl: 'https://picsum.photos/seed/picsum1/200/200', notes: 'Prefere esmaltes de cor clara.' },
    { id: 'client_2', name: 'Beatriz Costa', phone: '(21) 91234-5678', email: 'beatriz.costa@example.com', createdAt: new Date('2023-11-20').toISOString(), avatarUrl: 'https://picsum.photos/seed/picsum2/200/200', notes: 'Alérgica a removedores com acetona.' },
    { id: 'client_3', name: 'Carla Dias', phone: '(31) 95555-8888', email: 'carla.dias@example.com', createdAt: new Date('2024-01-05').toISOString(), avatarUrl: 'https://picsum.photos/seed/picsum3/200/200' },
    { id: 'client_4', name: 'Daniela Souza', phone: '(41) 94444-7777', email: 'daniela.souza@example.com', createdAt: new Date('2024-02-12').toISOString(), avatarUrl: 'https://picsum.photos/seed/picsum4/200/200', notes: 'Gosta de unhas de gel bem compridas.' },
];

export const DUMMY_APPOINTMENTS: Appointment[] = [
    { id: 'appt_1', clientId: 'client_1', serviceId: 'manicure_gel', date: new Date(today.setHours(10, 0, 0, 0)).toISOString(), status: 'scheduled', createdAt: new Date().toISOString() },
    { id: 'appt_2', clientId: 'client_2', serviceId: 'maintenance', date: new Date(today.setHours(14, 0, 0, 0)).toISOString(), status: 'scheduled', createdAt: new Date().toISOString() },
    { id: 'appt_3', clientId: 'client_3', serviceId: 'pedicure_classic', date: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(), status: 'scheduled', createdAt: new Date().toISOString() },
    { id: 'appt_4', clientId: 'client_4', serviceId: 'gel_nails', date: new Date(nextWeek.setHours(16, 0, 0, 0)).toISOString(), status: 'scheduled', createdAt: new Date().toISOString() },
    { id: 'appt_5', clientId: 'client_1', serviceId: 'manicure_classic', date: lastWeek.toISOString(), status: 'completed', createdAt: new Date().toISOString() },
    { id: 'appt_6', clientId: 'client_3', serviceId: 'manicure_gel', date: twoDaysAgo.toISOString(), status: 'completed', createdAt: new Date().toISOString() },
];
