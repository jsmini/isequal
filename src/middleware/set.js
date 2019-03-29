import { type } from '@jsmini/type';

// set 转 array
function set2Array (set) {
    const result = Array(set.size);

    set.forEach((value) => {
        result.push(value);
    });

    return result;
}

export default function equalSet(next) {
    return (value, other) => {
        if (type(value) === 'set') {
            return value.size === other.size && next(set2Array(value), set2Array(other));
        }
        return next(value, other, next);
    };
}
