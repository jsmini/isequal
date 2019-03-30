import { type } from '@jsmini/type';
export { compose } from '@jsmini/functional';
export { functionMiddleware } from './middleware.js';

function keys(obj) {
    const keyList = [];
    for(let k in obj) {
        if(obj.hasOwnProperty(k)) {
            keyList.push(k);
        }
    }
    return keyList;
}

function equalArray(value, other, enhancer) {
    if (value.length !== other.length) {
        return false;
    }

    for (let i = 0; i < value.length; i++) {
        if (!isEqual(value[i], other[i], enhancer)) {
            return false;
        }
    }

    return true;
}

function equalObject(value, other, enhancer) {
    const vKeys = keys(value);
    const oKeys = keys(other);

    if (vKeys.length !== oKeys.length) {
        return false;
    }

    for (let i = 0; i < vKeys.length; i++) {
        const v = value[vKeys[i]];
        const o = other[vKeys[i]];
        if (!isEqual(v, o, enhancer)) {
            return false;
        }
    }

    return true;
}

// map 转 array
function map2Array (map) {
    const result = Array(map.size);

    map.forEach(function (value, key) {
        result.push([key, value]);
    });
    return result;
}

function set2Array (set) {
    const result = Array(set.size);

    set.forEach((value) => {
        result.push(value);
    });

    return result;
}

export function isEqual (value, other, enhancer) {
    const next = () => {
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

        if (vType === 'set') {
            return value.size === other.size && isEqual(set2Array(value), set2Array(other), enhancer);
        }

        if (vType === 'map') {
            return value.size === other.size && isEqual(map2Array(value), map2Array(other), enhancer);
        }

        if (vType === 'array') { // 数组判断
            return equalArray(value, other, enhancer);
        }
        if (vType === 'object') { // 对象判断
            return equalObject(value, other, enhancer);
        }

        return value === other;
    };

    if(type(enhancer) === 'function') {
        const res = enhancer(value, other, next);

        // 兼容比较函数和中间件
        return type(res) === 'function' ?  enhancer(next)(value, other) : res;
    }
    return next();
}

export function isEqualJSON(value, other, replacer = false) {
    return JSON.stringify(value, replacer) === JSON.stringify(other, replacer);
}
