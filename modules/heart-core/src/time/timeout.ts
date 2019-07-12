/**
 * This is Promise wrapper of the setTimeout() function.
 */
export const timeout = (delay: number): Promise<any> => new Promise(resolve => setTimeout(resolve, delay));
