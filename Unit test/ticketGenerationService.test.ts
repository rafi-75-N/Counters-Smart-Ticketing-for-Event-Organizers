import { generateTicketsForOrder } from '@/lib/ticketGenerationService';

jest.mock('@/lib/mongo', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

const mockOrderFindOne = jest.fn();
const mockTicketFind = jest.fn();

jest.mock('@/model/model', () => ({
  __esModule: true,
  Order: { findOne: (...args: any[]) => mockOrderFindOne(...args) },
  Event: { findOne: jest.fn() },
  Ticket: { find: (...args: any[]) => mockTicketFind(...args) },
}));

// Supabase and pdf-lib are used deeper in the function; we mock them to avoid side effects
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn(),
      }),
    },
  }),
}));

jest.mock('pdf-lib', () => ({
  PDFDocument: { create: jest.fn() },
  rgb: jest.fn(),
  StandardFonts: {},
}));

describe('generateTicketsForOrder', () => {
  beforeEach(() => {
    mockOrderFindOne.mockReset();
    mockTicketFind.mockReset();
  });

  it('returns an error when orderId is missing', async () => {
    const res = await generateTicketsForOrder(undefined as any);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Order ID is required/i);
  });

  it('returns an error when payment is not completed', async () => {
    mockOrderFindOne.mockResolvedValue({
      order_id: 1,
      payment_status: 'pending',
      order_items: [],
    });

    const res = await generateTicketsForOrder(1);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Payment not completed/i);
  });

  it('returns existing tickets if already generated for the order', async () => {
    mockOrderFindOne.mockResolvedValue({
      order_id: 9,
      payment_status: 'completed',
      order_items: [],
    });

    mockTicketFind.mockResolvedValue([
      { ticket_id: 1, pass_id: 'A', attendee_name: 'John', user_ticketpdf: '/a.pdf' },
      { ticket_id: 2, pass_id: 'B', attendee_name: 'Jane', user_ticketpdf: '/b.pdf' },
    ]);

    const res = await generateTicketsForOrder(9);
    expect(res.success).toBe(true);
    expect(res.existing).toBe(true);
    expect(res.tickets).toHaveLength(2);
    expect(res.tickets[0]).toMatchObject({ ticket_id: 1, pass_id: 'A' });
  });
});
