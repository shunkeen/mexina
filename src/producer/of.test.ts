import { ex, of, toArray } from '../index';

test('empty', () => {
    const array = ex(of()).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = ex(of('a', 'b', 'c')).end(toArray());
    expect(array).toStrictEqual(['a', 'b', 'c']);
});
