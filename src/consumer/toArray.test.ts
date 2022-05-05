import { toArray, exArray, exGenerator, exIterable } from '../index';

test('empty', () => {
    const array = exArray<number>([]).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray([1, 2, 3, 4]).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const array = exGenerator(generator()).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const array = exIterable(iterable).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});
