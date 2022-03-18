import { extend } from './utils';

export default function extendModuleDefaults(...args) {
    return function extendOptions(obj = {}) {
        const moduleOptionName = Object.keys(obj)[0];
        const moduleOptions = obj[moduleOptionName];
        const options = args[0];
        const ps = args[args.length - 1];

        if (typeof moduleOptions !== 'object' || moduleOptions === null) {
            return false;
        }

        if (options[moduleOptionName] === true) {
            options[moduleOptionName] = { enable: true };
        }

        if (typeof options[moduleOptionName] === 'object' && !('enable' in options[moduleOptionName])) {
            options[moduleOptionName].enabled = true;
        }

        if (options[moduleOptionName] === false) {
            options[moduleOptionName] = { enable: false };
        }

        ps.options = extend(options, args[1], obj);
    }
}