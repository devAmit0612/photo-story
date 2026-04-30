import { extend } from './utils';
import { type Options } from '../types';

export interface PhotoStoryInstance {
  options: Options & Record<string, any>;
  [key: string]: any;
}

export default function extendModuleDefaults(
  moduleDefaults: Record<string, any>,
  ps: PhotoStoryInstance
) {
  return function extendOptions(defaults: Record<string, any> = {}): boolean | void {
    const moduleName = Object.keys(defaults)[0];

    if (!moduleName) return false;

    // Get the Module's hardcoded payload
    const builtinDef = defaults[moduleName];
    if (typeof builtinDef !== 'object' || builtinDef === null || Array.isArray(builtinDef)) {
      return false;
    }

    // Normalize the Core Global Defaults (in case it is just a boolean `true`)
    let coreDef = moduleDefaults[moduleName];
    if (coreDef === true) coreDef = { enabled: true };
    else if (coreDef === false) coreDef = { enabled: false };
    else if (typeof coreDef !== 'object' || coreDef === null) coreDef = {};

    // Normalize the User's config (in case they passed `{ fullscreen: true }`)
    let userDef = ps.options[moduleName];
    if (userDef === true) userDef = { enabled: true };
    else if (userDef === false) userDef = { enabled: false };
    else if (typeof userDef !== 'object' || userDef === null) userDef = {};

    // Safely deep merge ONLY this specific module's configuration
    // The primitive booleans are gone, so the objects will deep-merge perfectly!
    ps.options[moduleName] = extend({}, builtinDef, coreDef, userDef);
  };
}
