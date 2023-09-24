import { type } from '@jsmini/type';

export function functionMiddleware() {
  return (next) => (value, other) => {
    if (type(value) === 'function' && type(other) === 'function') {
      return value.toString() === other.toString();
    }

    return next(value, other);
  };
}
