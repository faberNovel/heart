import ModuleStorageInterface from '../../module/storage/ModuleStorageInterface';

/**
 * Checks if a module is a Storage one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards | User-Defined Type Guards}
 */
export default function isModuleStorage(module: ModuleStorageInterface | any): module is ModuleStorageInterface {
  const m = module as ModuleStorageInterface;

  return m.Storage !== undefined && 'function' === typeof m.Storage;
}
