import { EventEmitter } from 'events';

/**
 * Define a Notification.
 * Every Notification module must have a class that implements this interface.
 */
export default interface NotificationInterface {
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
export type NotificationConstructor = new () => NotificationInterface;
