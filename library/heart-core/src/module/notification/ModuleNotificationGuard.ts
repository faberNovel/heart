import ModuleNotificationInterface from '../../module/notification/ModuleNotificationInterface';

/**
 * Checks if a module is a Notification one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export default function isModuleNotification(module: ModuleNotificationInterface | any): module is ModuleNotificationInterface {
  const m = module as ModuleNotificationInterface;

  return m.Notification !== undefined && 'function' === typeof m.Notification;
}
