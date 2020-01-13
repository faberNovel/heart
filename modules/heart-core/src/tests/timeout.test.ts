'use strict';

import { timeout } from '../time/timeout';

jest.useFakeTimers();

test('the timeout wrapper is expected to run a real timeout', () => {
    timeout(30);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 30);
});
