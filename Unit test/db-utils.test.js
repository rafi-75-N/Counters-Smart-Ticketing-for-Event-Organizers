jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    Schema: actual.Schema,
    models: {},
    model: jest.fn(() => ({ findByIdAndUpdate: jest.fn() })),
  };
});

const { getNextSequence, Counter } = require('@/lib/db-utils');

describe('db-utils', () => {
  it('getNextSequence increments and returns the new sequence_value', async () => {
    Counter.findByIdAndUpdate = jest.fn().mockResolvedValue({ sequence_value: 42 });

    const val = await getNextSequence('order_id');
    expect(Counter.findByIdAndUpdate).toHaveBeenCalledWith(
      'order_id',
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    expect(val).toBe(42);
  });
});
