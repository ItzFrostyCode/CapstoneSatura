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
        {
          id: 'MSG-003',
          sender: 'HQ Admin',
          senderName: 'Sutura Support',
          message:
            'This issue has been resolved. The sync worker was temporarily paused. Your inventory should now reflect the correct 50 units. Please verify.',
          timestamp: '2026-05-08T14:10:00Z',
        },
        {
          id: 'MSG-004',
          sender: 'User',
          senderName: 'John Clock',
          message: 'Confirmed! The stock is showing up correctly now. Thank you.',
          timestamp: '2026-05-08T14:15:00Z',
        },
      ],
    },
    {
      id: 'TCK-2605-002',
      shopId: 'SHOP-001',
      creatorId: 'USR-001',
      subject: 'Cannot upload new design assets for Bulk Orders',
      category: 'Complaint',
      status: 'Open',
      priority: 'Urgent',
      createdAt: '2026-05-09T09:00:00Z',
      updatedAt: '2026-05-09T09:00:00Z',
      messages: [
        {
          id: 'MSG-005',
          sender: 'User',
          senderName: 'John Clock',
          message:
            'The asset upload button in the Create Order flow is completely unresponsive on my iPad. I need to upload measurement sheets for a large school uniform bulk order by this afternoon.',
          timestamp: '2026-05-09T09:00:00Z',
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