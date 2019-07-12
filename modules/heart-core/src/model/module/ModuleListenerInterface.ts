import { EventEmitter } from 'events';

import ModuleInterface from './ModuleInterface';

/**
 * Define an Listener module.
 */
export default interface ModuleListenerInterface extends ModuleInterface {
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
export type ModuleListener = new () => ModuleListenerInterface;

/**
 * Checks if a module is a Listener one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export function isModuleListener(module: ModuleInterface): module is ModuleListenerInterface {
  const m = module as ModuleListenerInterface;

  return m !== undefined && m.registerEvents !== undefined && 'function' === typeof m.registerEvents;
}
