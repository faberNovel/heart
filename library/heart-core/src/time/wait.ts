/**
 * Wait a certain amount of time.
 * This is Promise wrapper of the setTimeout() function.
 */
export const wait = (delay: number): Promise<any> => new Promise(resolve => setTimeout(resolve, delay));
