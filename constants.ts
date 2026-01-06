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


export const DUMMY_CLIENTS: Client[] = [];

export const DUMMY_APPOINTMENTS: Appointment[] = [];
