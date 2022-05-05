import { toArray, exArray } from '../index';

test('empty', () => {
    const array = exArray<number>([]).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray([1, 2, 3, 4]).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});
