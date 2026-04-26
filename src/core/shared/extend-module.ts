import { extend } from './utils';
import { type Options } from '../types';

export interface PhotoStoryInstance {
  options: Options & Record<string, any>;
  [key: string]: any;
}

export default function extendModuleDefaults(
  options: Options & Record<string, any>,
  moduleDefaults: Record<string, any>,
  ps: PhotoStoryInstance
) {
  return function extendOptions(obj: Record<string, any> = {}): boolean | void {
    const moduleOptionName = Object.keys(obj)[0];

    if (!moduleOptionName) return false;

    const moduleOptions = obj[moduleOptionName];

    if (
      typeof moduleOptions !== 'object' ||
      moduleOptions === null ||
      Array.isArray(moduleOptions)
    ) {
      return false;
    }

    if (options[moduleOptionName] === true) {
      options[moduleOptionName] = { enable: true };
    } else if (options[moduleOptionName] === false) {
      options[moduleOptionName] = { enable: false };
    }

    if (
      typeof options[moduleOptionName] === 'object' &&
      options[moduleOptionName] !== null &&
      !('enable' in options[moduleOptionName])
    ) {
      options[moduleOptionName].enable = true;
    }

    // 2. Type Assertion: Tell TS the merged result is definitely our Options type
    ps.options = extend(options, moduleDefaults, obj) as Options & Record<string, any>;
  };
}
