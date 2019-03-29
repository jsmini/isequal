import { type } from '@jsmini/type';

// map 转 array
function map2Array (map) {
    const result = Array(map.size);

    map.forEach(function (value, key) {
        result.push([key, value]);
    });
    return result;
}

export default function equalMap(next) {
    return (value, other) => {
        if (type(value) === 'map') {
            return value.size === other.size && next(map2Array(value), map2Array(other));
        }
        return next(value, other, next);
    };
}
