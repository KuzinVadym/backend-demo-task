import { validateStatusTransition } from '../validateStatusTransition';

describe('validateStatusTransition', () => {
  it('allows ToDo -> ToDo', async () => {
    expect(validateStatusTransition('ToDo', 'ToDo')).toEqual(true);
  });
  it('allows ToDo -> InProgress', async () => {
    expect(validateStatusTransition('ToDo', 'InProgress')).toEqual(true);
  });
  it('blocks ToDo -> InQA', async () => {
    expect(validateStatusTransition('ToDo', 'InQA')).toEqual(false);
  });
});
