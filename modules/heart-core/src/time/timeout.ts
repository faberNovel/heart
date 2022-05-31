/**
 * This is Promise wrapper of the setTimeout() function.
 */
export const timeout = (delay: number): Promise<object> => new Promise(resolve => setTimeout(resolve, delay));
