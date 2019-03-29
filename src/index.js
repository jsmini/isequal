import { type } from '@jsmini/type';
import { compose } from '@jsmini/functional';
import equalMap from './middleware/map';
import equalSet from './middleware/set';

function keys(obj) {
    const keyList = [];
    for(let k in obj) {
        if(obj.hasOwnProperty(k)) {
            keyList.push(k);
        }
    }
    return keyList;
}

function equalArray(value, other) {
    if (value.length !== other.length) {
        return false;
    }

    for (let i = 0; i < value.length; i++) {
        if (!isEqual(value[i], other[i])) {
            return false;
        }
    }

    return true;
}

function equalObject(value, other) {
    const vKeys = keys(value);
    const oKeys = keys(other);

    if (vKeys.length !== oKeys.length) {
        return false;
    }

    for (let i = 0; i < vKeys.length; i++) {
        const v = value[vKeys[i]];
        const o = other[vKeys[i]];
        if (!isEqual(v, o)) {
            return false;
        }
    }

    return true;
}

const defaultMiddleware = [
    equalMap,
    equalSet,
];

export function isEqual (value, other, opts) {
    const next = (value, other) => {
        // 全等
        if (value === other) {
            // 这里为了区别 +0 和 -0, 因为 1 / -0 = -Infinite, 1 / +0 = +Infinite
            return value !== 0 || 1 / value === 1 / other;
        }
    
        const vType = type(value, true);
        const oType = type(other, true);
    
        // 类型不同
        if (vType !== oType) {
            return false;
        }
        
        // NaN
        if (value !== value && other !== other) {
            return true;
        }
    
        // new Boolean|Number|Date
        if (vType === 'Boolean' || vType === 'Number' || vType === 'date') {
            return +value === +other;
        }
    
        // new String | /123/ | new RegExp
        if (vType === 'String' || vType === 'regexp') {
            return String(value) === String(other);
        }
    
        if (vType === 'array') { // 数组判断
            return equalArray(value, other);
        }
        if (vType === 'object') { // 对象判断
            return equalObject(value, other);
        }
    
        return value === other;
    };

    let middlewares;
    if (type(opts) === 'array') {
        for (const fn of opts) {
            if (typeof fn !== 'function') {
                throw new TypeError('Middleware must be composed of functions');
            }
        }
        middlewares = opts;
    } else if (type(opts) === 'function') {
        middlewares = [ opts ];
    } else {
        middlewares = [];
    }

    middlewares = middlewares.concat(defaultMiddleware);

    return compose(...middlewares)(next)(value, other);
}

export function isEqualJSON(value, other, replacer = false) {
    return JSON.stringify(value, replacer) === JSON.stringify(other, replacer);
}
