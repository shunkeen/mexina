import { ex, fromArray, toArray } from '../index';

test('empty', () => {
    const array = ex(fromArray('')).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = ex(fromArray('abc')).end(toArray());
    expect(array).toStrictEqual(['a', 'b', 'c']);
});
