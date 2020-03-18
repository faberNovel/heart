import { timeout } from '../src/time/timeout';

jest.useFakeTimers();

it('should run a real timeout', () => {
  timeout(30);

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 30);
});
