import { StateCreator } from 'zustand';
import { SupportTicket, SupportTicketCategory, Priority } from '@/types/erp';
import { ERPStore } from '../useERPStore';

export interface CreateTicketParams {
  shopId: string;
  creatorId: string;
  subject: string;
  category: SupportTicketCategory;
  priority: Priority;
}

export interface AddMessageParams {
  sender: 'User' | 'HQ Admin';
  senderName: string;
  message: string;
}

export interface SupportSlice {
  supportTickets: SupportTicket[];
  createSupportTicket: (ticketParams: CreateTicketParams) => void;
  addTicketMessage: (ticketId: string, messageParams: AddMessageParams) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
}

const generateTicketId = (): string => {
  const date = new Date();
  const yearMonth = `${date.getFullYear().toString().slice(-2)}${String(
    date.getMonth() + 1
  ).padStart(2, '0')}`;
  const randomSequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `TCK-${yearMonth}-${randomSequence}`;
};

const generateMessageId = (): string =>
  `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const createSupportSlice: StateCreator<ERPStore, [], [], SupportSlice> = (
  set
) => ({
  supportTickets: [
    {
      id: 'TCK-2605-001',
      shopId: 'SHOP-001',
      creatorId: 'USR-001',
      subject: 'Inventory stock not updating after transfer',
      category: 'Technical Issue',
      status: 'Resolved',
      priority: 'High',
      createdAt: '2026-05-07T10:32:00Z',
      updatedAt: '2026-05-08T14:15:00Z',
      messages: [
        {
          id: 'MSG-001',
          sender: 'User',
          senderName: 'John Clock',
          message:
            'Hi Support, I just transferred 50 units of Cotton Twill to the main branch, but the inventory count still says 0. Please help!',
          timestamp: '2026-05-07T10:32:00Z',
        },
        {
          id: 'MSG-002',
          sender: 'HQ Admin',
          senderName: 'Sutura Support',
          message: 'Hello John! We apologize for the inconvenience. Our technical team has identified a database sync issue affecting the profile module. We are currently deploying a fix. Can you try again in about 30 minutes?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        }
      ]
    },
    {
      id: 'TCK-2605-002',
      creatorId: 'STF-001',
      shopId: 'SYSTEM',
      subject: 'UI Glitch: Dashboard cards are overlapping on mobile',
      category: 'Technical Issue',
      status: 'Open',
      priority: 'Normal',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        {
          id: 'MSG-003',
          sender: 'User',
          senderName: 'John Clock',
          message: 'The dashboard looks a bit messy on my iPhone. The "My Tailoring" cards are overlapping each other. Can you look into the responsive layout?',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        }
      ]
    },

  ],

  createSupportTicket: (ticketParams: CreateTicketParams) => {
    set((state) => {
      const now = new Date().toISOString();

      const newTicket: SupportTicket = {
        ...ticketParams,
        id: generateTicketId(),
        status: 'Open',
        createdAt: now,
        updatedAt: now,
        messages: [],
      };

      return {
        supportTickets: [newTicket, ...state.supportTickets],
      };
    });
  },

  addTicketMessage: (ticketId: string, messageParams: AddMessageParams) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        const now = new Date().toISOString();

        return {
          ...ticket,
          updatedAt: now,
          messages: [
            ...ticket.messages,
            {
              ...messageParams,
              id: generateMessageId(),
              timestamp: now,
            },
          ],
        };
      }),
    }));
  },

  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        return {
          ...ticket,
          status,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
});