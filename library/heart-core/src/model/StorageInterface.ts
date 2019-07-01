import { EventEmitter } from 'events';

/**
 * Define a Storage.
 * Every Storage module must have a class that implements this interface.
 */
export default interface StorageInterface {
  /**
   * Register events on the given emitter.
   * Note: this method must be public.
   */
  registerEvents(eventEmitter: EventEmitter): void;
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type StorageConstructor = new () => StorageInterface;
