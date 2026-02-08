
import { Client, LeadStatus } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'CL-8921',
    name: 'Jonathan Smith',
    email: 'j.smith@email.com',
    phone: '+1 (555) 012-3456',
    location: 'Austin, TX',
    profession: 'Senior Software Architect',
    status: LeadStatus.WARM,
    intent: 'High-intent buyer',
    notes: 'Looking for a 3-bedroom modern farmhouse in East Austin. Prefers high ceilings and a large backyard for their dog. Budgeting around $850k.',
    budget: '$850k',
    nextFollowUp: '2023-10-24T10:00:00',
    avatar: 'https://picsum.photos/seed/jon/200'
  },
  {
    id: 'CL-8922',
    name: 'Robert Fox',
    email: 'robert.fox@email.com',
    phone: '+1 234 567 890',
    location: 'New York, NY',
    profession: 'Creative Director',
    status: LeadStatus.HOT,
    intent: 'Luxury seeker',
    notes: 'Interested in downtown penthouses with terrace.',
    budget: '$2.5M',
    nextFollowUp: '2023-11-01T14:30:00',
    avatar: 'https://picsum.photos/seed/rob/200'
  },
  {
    id: 'CL-8942',
    name: 'Sarah Jenkins',
    email: 'sarah.j@cloud.com',
    phone: '+1 987 654 321',
    location: 'Los Angeles, CA',
    profession: 'Medical Specialist',
    status: LeadStatus.VIEWING,
    intent: 'Frequent viewer',
    notes: 'Revisiting the Malibu estate next week.',
    budget: '$5.0M',
    nextFollowUp: '2023-10-25T09:00:00',
    avatar: 'https://picsum.photos/seed/sarah/200'
  },
  {
    id: 'CL-7731',
    name: 'Cody Fisher',
    email: 'cody.f@realty.io',
    phone: '+1 555 012 345',
    location: 'Chicago, IL',
    profession: 'Tech Entrepreneur',
    status: LeadStatus.CLOSED,
    intent: 'Relocating',
    notes: 'Deal closed successfully. Sending closing gifts.',
    budget: '$1.2M',
    nextFollowUp: '2023-12-15T10:00:00',
    avatar: 'https://picsum.photos/seed/cody/200'
  }
];

export const CURRENT_USER = {
  name: 'Jane Cooper',
  title: 'Senior Real Estate Agent',
  phone: '+1 (555) 000-0000',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
};
