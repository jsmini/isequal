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
        if (value[i] !== other[i] && !isEqual(value[i], other[i], compare)) {
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
        if (v !== o && !isEqual(v, o, compare)) {
            return false;
        }
    }

    return true;
}

export function isEqual (value, other, compare) {
    const next = () => {
        // 全等
        if (value === other) {
            return true;
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

        // new Boolean|Number
        if (vType === 'Boolean' || vType === 'Number') {
            return +value === +other;
        }

        // new String
        if (vType === 'String') {
            return String(value) === String(other);
        }

        if (vType === 'array') {
            return equalArray(value, other, compare);
        }

        if (vType === 'object') {
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
