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

        // null 今早退出判断，以防进入 equalObject 判断
        if (value === null || other === null) {
            return false;
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

        switch (vType) {
        case 'Boolean':
        case 'Date':
        case 'Number':
            return +value === +other;
        case 'String':
        case 'regexp':
            return '' + value === '' + other;
        }

        if (vType !== 'array') {
            // 存在 函数的情况
            if (vType !== 'object' || oType !== 'object') {
                return false;
            }
            
            var vCtor = value.constructor;
            var oCtor = other.constructor;
            // value 和 other 构造函数都存在且不相等，那么他们就不该相等
            if (
                vCtor !== oCtor &&
                !(
                    type(vCtor, true) === 'function' &&
                    type(oCtor, true) === 'function' &&
                    'constructor' in value &&
                    'constructor' in other
                )
            ) {
                return false;
            }
        }
        if (vType === 'array') { // 数组判断
            return equalArray(value, other, compare);
        } else { // 对象判断
            return equalObject(value, other, compare);
        }
    };

    if(type(compare) === 'function') {
        return compare(value, other, next);
    }
    return next();
}

export function isEqualJSON(value, other, replacer = false) {
    var vType = type(value);
    var oType = type(other);
    if (vType === 'regexp') {
        value = {};
    }
    if (oType === 'regexp') {
        other = {};
    }
    // -0 should not equal +0
    if (value === 0 && 1 / value !== 1 / other) {
        return false;
    }
    return JSON.stringify(value, replacer) === JSON.stringify(other, replacer);
}
