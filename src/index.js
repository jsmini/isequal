import { type } from '@jsmini/type';

function keys(obj) {
    const keyList = [];
    for(let k in obj) {
        if(obj.hasOwnProperty(k)) {
            keyList.push(k);
        }
    }
    return keyList;
}

function equalArray(value, other, compare) {
    if (value.length !== other.length) {
        return false;
    }

    for (let i = 0; i < value.length; i++) {
        if (!isEqual(value[i], other[i], compare)) {
            return false;
        }
    }

    return true;
}

function equalObject(value, other, compare) {
    const vKeys = keys(value);
    const oKeys = keys(other);

    if (vKeys.length !== oKeys.length) {
        return false;
    }

    for (let i = 0; i < vKeys.length; i++) {
        const v = value[vKeys[i]];
        const o = other[vKeys[i]];
        if (!isEqual(v, o, compare)) {
            return false;
        }
    }

    return true;
}

export function isEqual (value, other, compare) {
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

        if (vType === 'array') { // 数组判断
            return equalArray(value, other, compare);
        }
        if (vType === 'object') { // 对象判断
            return equalObject(value, other, compare);
        }

        return value === other;
    };

    if(type(compare) === 'function') {
        return compare(value, other, next);
    }
    return next();
}

export function isEqualJSON(value, other, replacer = false) {
    return JSON.stringify(value, replacer) === JSON.stringify(other, replacer);
}
