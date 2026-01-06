
export interface User {
  id: string;
  username: string;
  passwordHash: string; // In a real app this would be a securely generated hash
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
  avatarUrl: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string; // ISO string for date and time
  price: number;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}