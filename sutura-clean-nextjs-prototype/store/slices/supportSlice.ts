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
          message:
            'Hello Joshua, we have received your ticket. We are currently looking into the sync issue on the Main Branch database.',
          timestamp: '2026-05-07T10:45:00Z',
        },
      ],
    },
    {
      id: 'TCK-2605-003',
      shopId: 'SHOP-001',
      creatorId: 'USR-DESIGNER-01',
      subject: 'Blueprint Forward to Shop failing for High-Resolution images',
      category: 'Technical Issue',
      status: 'Open',
      priority: 'High',
      createdAt: '2026-05-11T14:20:00Z',
      updatedAt: '2026-05-11T14:20:00Z',
      messages: [
        {
          id: 'MSG-006',
          sender: 'User',
          senderName: 'Neneng B',
          message:
            'Every time I try to "Confirm & Forward" a blueprint with more than 3 high-res sketches, the system hangs and shows a 413 Payload Too Large error.',
          timestamp: '2026-05-11T14:20:00Z',
        },
      ],
    },
    {
      id: 'TCK-2605-004',
      shopId: 'SHOP-001',
      creatorId: 'USR-DESIGNER-01',
      subject: 'New Embroidery Pattern library access',
      category: 'Feature Request',
      status: 'In Progress',
      priority: 'Medium',
      createdAt: '2026-05-12T09:30:00Z',
      updatedAt: '2026-05-12T10:15:00Z',
      messages: [
        {
          id: 'MSG-007',
          sender: 'User',
          senderName: 'Neneng B',
          message: 'Can we add a "Barong Tagalog" embroidery preset section in the design blueprints? It would save a lot of time for custom orders.',
          timestamp: '2026-05-12T09:30:00Z',
        },
        {
          id: 'MSG-008',
          sender: 'HQ Admin',
          senderName: 'Sutura Support',
          message: 'Great suggestion, Neneng! We are passing this to the product team for the next sprint update.',
          timestamp: '2026-05-12T10:15:00Z',
        },
      ],
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