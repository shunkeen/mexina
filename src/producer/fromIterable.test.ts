import { ex, fromIterable, toArray, at } from '../index';

test('empty', () => {
    const array = ex(fromIterable('')).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = ex(fromIterable('abc')).end(toArray());
    expect(array).toStrictEqual(['a', 'b', 'c']);
});

test('infinite', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* ['a', 'b', 'c'];
        },
    };

    const x = ex(fromIterable(infinite)).end(at(1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});
