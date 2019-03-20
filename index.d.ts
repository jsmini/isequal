// https://www.tslang.cn/docs/handbook/declaration-files/by-example.html

/** 组件总数 */
// declare var foo: number;

export as namespace jsminiIsequal;

export function isEqual(value: any, other: any, compare?: (value: any, other: any, next: () => boolean) => boolean): boolean;
export function isEqualJSON(value: any, other: any, replacer?: (k, v) => any | string[]): boolean;
