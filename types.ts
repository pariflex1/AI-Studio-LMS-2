
export enum LeadStatus {
  HOT = 'Hot Lead',
  WARM = 'Warm Prospect',
  COLD = 'Cold Lead',
  NEW = 'New Lead',
  VIEWING = 'Viewing',
  CLOSED = 'Closed Deal',
  LOST = 'Lost'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profession: string;
  status: LeadStatus;
  notes: string;
  budget: string;
  nextFollowUp: string;
  avatar?: string;
  intent?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  phone: string;
  avatar: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
